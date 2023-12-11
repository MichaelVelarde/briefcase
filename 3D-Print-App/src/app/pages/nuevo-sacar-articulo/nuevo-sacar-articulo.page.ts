import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { firebaseUrls, Inventario, ItemSacado } from 'src/app/models';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-nuevo-sacar-articulo',
  templateUrl: './nuevo-sacar-articulo.page.html',
  styleUrls: ['./nuevo-sacar-articulo.page.scss'],
})
export class NuevoSacarArticuloPage implements OnInit {
  public sacarDeInventario: ItemSacado;
  public items = [];
  public paso : number;

  constructor(public alertController: AlertController, private router: Router, private storage: Storage, private apiService:  ApiService) { }

  async ngOnInit() {
    await this.getDataStorage();
    
  }
  async getDataStorage(){
    await this.storage.get('paso').then((numero) => {
      this.paso = numero;
    });
    if(this.paso > 0){
      await this.storage.get('sacarItem').then((sacarItem) => {
        this.sacarDeInventario = sacarItem;
      });
      if(this.sacarDeInventario.articuloskeys.length >0)
        await this.storage.get('itemsSacados').then((item) => {
          this.items = item
        });
    } 
  }
  async deleteItem(index : number){
    this.items.splice(index,1); 
    this.sacarDeInventario.articulosCant.splice(index,1);
    this.sacarDeInventario.articulosCantCadaLocal.splice(index,1); 
    this.sacarDeInventario.articulosKeysCadaLocal.splice(index,1);
    this.sacarDeInventario.articuloskeys.splice(index,1);
    await this.storage.set('sacarItem', this.sacarDeInventario);
    await this.storage.set('itemsSacados', this.items);
  }

  async agregarArticulosSacados(){
      let d = new Date();
      let date = d.setDate(d.getDate());
      this.sacarDeInventario.date = new Date(date).toISOString().slice(0, 10);
      await this.descontarCantidades(this.sacarDeInventario);
      this.apiService.addLog('Agrego descontar de almacen con fecha: ' + this.sacarDeInventario.date);
      await this.apiService.add(firebaseUrls.itemsSacados, this.sacarDeInventario ).then((data) => {
        this.alertController.create({
          subHeader: 'Se desconto los articulos correctamente!'  ,
          buttons: [
            {
              text: 'Continuar',
              handler: () => {
                this.router.navigate(['sacar-almacen',{nItemSacado: this.paso}])
              }
            },
          ]
        }).then(res => {
          res.present();
        });
        
      });
  }
  async addItem(){
    await this.storage.set('paso', this.paso +1 );
    this.router.navigate(['escoger-articulo-sacar',{paso: this.paso +1}])
  }

  async descontarCantidades(itemSacado : ItemSacado){
    for (let i = 0; i < itemSacado.articuloskeys.length; i++){
        await this.descItem(itemSacado , i);
    }
  }
  async descItem(itemSacado : ItemSacado , pos : number){
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
        itemAux.almacenesCantidades[index] = itemAux.almacenesCantidades[index] - itemSacado.articulosCantCadaLocal[pos][j];
      }
      itemAux.cantTotal = itemAux.cantTotal - itemSacado.articulosCant[pos];
      await this.apiService.update(firebaseUrls.inventario,itemSacado.articuloskeys[pos] , itemAux );
    })
  }
  

}
