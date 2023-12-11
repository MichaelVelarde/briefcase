import { Component, OnInit } from '@angular/core';
import { Almacen, firebaseUrls, Inventario, ItemSacado } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-escoger-articulo-sacar',
  templateUrl: './escoger-articulo-sacar.page.html',
  styleUrls: ['./escoger-articulo-sacar.page.scss'],
})
export class EscogerArticuloSacarPage implements OnInit {
  public almacenes : Almacen[];
  public inventario : Inventario [];
  public inventarioFiltrado : Inventario [];
  public itempicked :Inventario;
  public almacenesCant = [];
  public almacenesKeys = [];
  public sacarDeInventario: ItemSacado;
  public items = [];
  public paso : number;

  constructor(private router: Router, private apiService:  ApiService,public alertController: AlertController, private storage: Storage) { }

  async ngOnInit() {
    await this.getDataStorage2();
    await this.getAlmacenes();
    await this.getItems();
   }
   
   async getItems(){
    const aux = this.apiService.getAll(firebaseUrls.inventario).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.inventario =data;
      aux.unsubscribe();
    }).add( () =>{
      if(this.sacarDeInventario.articuloskeys.length !=0 )
        this.inventario = this.inventario.filter( item =>! this.sacarDeInventario.articuloskeys.includes(item.idDb) );
      this.inventarioFiltrado = this.inventario
    }); 
  }
  getcantidad(almacen:Almacen){
    if(this.almacenesKeys.includes(almacen.idDb)){
      let index = this.almacenesKeys.findIndex(key => key == almacen.idDb);
      return this.almacenesCant[index];
    }
    return 0;
  }
  search(){
    this.inventarioFiltrado =[];
    var aux = document.getElementsByName("filtroBusquedaSacar");
    //console.log(aux.length);
    var filtro = (<HTMLInputElement>aux.item(aux.length-1)).value;
    var aux2 = document.getElementsByName("textInputSacar");

    var inputValue = (<HTMLInputElement>aux2.item(aux2.length-1)).value;
    for (let i = 0; i < this.inventario.length; i++){
      if(filtro == "name" && this.inventario[i].nombre.toLowerCase().includes( inputValue.toLowerCase())){
        this.inventarioFiltrado.push(this.inventario[i]);
      }
      if(filtro == "id" && this.inventario[i].id == parseInt(inputValue) ){
        this.inventarioFiltrado.push(this.inventario[i]);
      }
    }
  }
  getCantAlmacen(almacen : Almacen){
    let index = this.itempicked.almacenesKeys.findIndex(key => key == almacen.idDb);
    return this.itempicked.almacenesCantidades[index];
  }
  pickCant(almacen : Almacen){
    const maxCant = this.getCantAlmacen(almacen);
    this.alertController.create({
      subHeader: 'Cantidad a descontar del almacen ' + almacen.nombre ,
      inputs:[{
            name:'number',
            placeholder: '0',
            type: 'number',
            min: '0',
            max: maxCant
        }],
      buttons: [
        {
          text: 'Continuar',
          handler: data =>{
            if(parseInt(data.number) > maxCant)
              alert("Cantidad Invalida!");
            else
              if(!this.almacenesKeys.includes(almacen.idDb)){
                this.almacenesCant.push(parseInt(data.number));
                this.almacenesKeys.push(almacen.idDb);
              }
              else{
                let index = this.almacenesKeys.findIndex(key => key == almacen.idDb);
                this.almacenesCant[index] = parseInt(data.number);
              }
        }
        },
        {
          text: 'Cancelar',
        }
      ]
    }).then(res => {
      res.present();
    });
  }
  
  pickItem(obj : Inventario){
    this.itempicked = obj;
    this.almacenes = this.almacenes.filter(almacen => this.itempicked.almacenesKeys.includes(almacen.idDb) );
  }
  escogioCantidad(){
    this.almacenesCant = this.almacenesCant.filter( almacenCant => almacenCant !=0 )
    if(this.almacenesCant.length > 0) return true;
    else return false;
  }

  async getAlmacenes(){
    const aux = this.apiService.getAll(firebaseUrls.almacenes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.almacenes =data;
      aux.unsubscribe();
    })
  }
  async AgregarVenta(){
    if(this.escogioCantidad()){
      let cantTotal = 0;
      for (let i = 0; i < this.almacenesCant.length; i++) {
        cantTotal += this.almacenesCant[i];
      }
      this.sacarDeInventario.articulosCant.push(cantTotal);
      this.sacarDeInventario.articulosCantCadaLocal.push(this.almacenesCant);
      this.sacarDeInventario.articulosKeysCadaLocal.push(this.almacenesKeys);     
      this.sacarDeInventario.articuloskeys.push(this.itempicked.idDb);
      this.items.push (this.itempicked);
      this.itempicked = undefined;
      await this.storage.set('sacarItem', this.sacarDeInventario);
      await this.storage.set('itemsSacados', this.items);
      await this.storage.set('paso', this.paso+1);
      this.router.navigate(['nuevo-sacar-articulo',{paso: this.paso+1}])
    }
    
  }


  async getDataStorage2(){
    await this.storage.get('sacarItem').then((sacarItem) => {
      this.sacarDeInventario = sacarItem;
    });
    await this.storage.get('paso').then((numero) => {
      this.paso = numero;
    });
    if(this.sacarDeInventario.articuloskeys.length >0)
      await this.storage.get('itemsSacados').then((item) => {
        this.items = item
      });
  }
}
