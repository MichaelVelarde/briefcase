import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { firebaseUrls, Inventario, ItemSacado } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { LoginUserService } from 'src/app/services/login-user.service';

@Component({
  selector: 'app-sacar-almacen',
  templateUrl: './sacar-almacen.page.html',
  styleUrls: ['./sacar-almacen.page.scss'],
})
export class SacarAlmacenPage implements OnInit {
  public sacados : ItemSacado[];
  public donwloadingDataB = true;
  public activeUserAdmin = false;

  constructor(private userService : LoginUserService ,private storage: Storage,private alertController: AlertController,private router: Router,private apiService:  ApiService) { }

  async ngOnInit() {
    this.activeUserAdmin = this.userService.getUsuario().admin;
    this.donwloadingDataB = true;
    await this.getSacados();
  }
  async navegarCreate(){
    var AuxScarAlmacen :ItemSacado;
    AuxScarAlmacen ={
      articulosCant : [],
      articuloskeys : [],
      articulosCantCadaLocal : [],
      articulosKeysCadaLocal : [],
      date : ''
    }
    await this.storage.create();
    await this.storage.set('paso', 0);
    await this.storage.set('sacarItem', AuxScarAlmacen);
    this.router.navigate(['nuevo-sacar-articulo',{sacarArticulo: this.sacados.length}]);
  }
  async getSacados(){
    const aux = this.apiService.getAll(firebaseUrls.itemsSacados).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.sacados =data;
      aux.unsubscribe();
    }).add( () =>{
      this.sacados.reverse();
      this.donwloadingDataB = false;
    }); 
  }

  borrarItemSacado(itemSacado : ItemSacado){
    this.alertController.create({
      subHeader: 'Seguro que desea borrar la operacion realizada el: ' + itemSacado.date ,
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.deleteItemSacado(itemSacado);
          }
        },
        {
          text: 'No',
        }
      ]
    }).then(res => {
      res.present();
    });
  }
 
  async verItemSacado(itemSacado : ItemSacado){
    await this.storage.create();
    await this.storage.set('itemSacado', itemSacado);
    this.router.navigate(['ver-articulo-sacado',{id : itemSacado.id}])
  }

  async deleteItemSacado(itemSacado : ItemSacado){
    await this.sumarCant(itemSacado);
    this.apiService.addLog('Cancelo el descontar de almacen de fecha: ' + itemSacado.date);
    await this.apiService.remove(firebaseUrls.itemsSacados, itemSacado.id ).then((data) => {
      this.alertController.create({
        subHeader: 'Se restauro las cantidades del articulo correctamente!'  ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              this.getSacados();
            }
          },
        ]
      }).then(res => {
        res.present();
      });
      
    });
  }
  async sumarCant(itemSacado : ItemSacado){
    for (let i = 0; i < itemSacado.articuloskeys.length; i++){
       await this.sumarItem(itemSacado , i);
    } 
  }
  async sumarItem(itemSacado : ItemSacado , pos : number){
    var itemAux : Inventario;
    let aux = this.apiService.getOne(firebaseUrls.inventario , itemSacado.articuloskeys[pos]).snapshotChanges().pipe(
      map(c=>  ({
        id: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      itemAux = data;
      aux.unsubscribe();
    }).add( async ()=>{
      for (let j = 0; j < itemSacado.articulosKeysCadaLocal[pos].length; j++){
        let index = itemAux.almacenesKeys.findIndex(valor => valor == itemSacado.articulosKeysCadaLocal[pos][j] );
        itemAux.almacenesCantidades[index] = itemAux.almacenesCantidades[index] + itemSacado.articulosCantCadaLocal[pos][j];
      }
      itemAux.cantTotal = itemAux.cantTotal + itemSacado.articulosCant[pos];
      await this.apiService.update(firebaseUrls.inventario,itemSacado.articuloskeys[pos] , itemAux );
    })
  }
}
