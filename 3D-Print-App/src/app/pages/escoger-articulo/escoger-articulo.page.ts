import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Almacen, firebaseUrls, Inventario, Proforma, Venta } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-escoger-articulo',
  templateUrl: './escoger-articulo.page.html',
  styleUrls: ['./escoger-articulo.page.scss'],
})
export class EscogerArticuloPage implements OnInit {
  public almacenes : Almacen[];
  public proforma : Proforma;
  public isAproforma : boolean = false;
  public inventario : Inventario [];
  public inventarioFiltrado : Inventario [];
  public itempicked :Inventario;
  public almacenesCant = [];
  public almacenesKeys = [];
  public venta: Venta;
  public items = [];
  public descuentoItem : number = 0;
  public paso : number;
  
  constructor(private router: Router, private apiService:  ApiService,public alertController: AlertController, private storage: Storage) { }

 async ngOnInit() {
  if(window.location.href.includes('proforma')){
    await this.getDataStorageProforma();
    this.isAproforma = true;
  }
  else
   await this.getDataStorage2();

   await this.getAlmacenes();
   await this.getItems();
  }
  

  //get Inventario
  async getItems(){
    const aux = this.apiService.getAll(firebaseUrls.inventario).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.inventario =data;
      aux.unsubscribe();
    }).add( () =>{
      if( this.isAproforma)
        this.inventario = this.inventario.filter( item =>! this.proforma.articulosids.includes(item.id) );
      
      if( !this.isAproforma && this.venta.articuloskeys.length !=0 )
        this.inventario = this.inventario.filter( item =>! this.venta.articuloskeys.includes(item.idDb) );
      
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
    var aux = document.getElementsByName("filtroBusqueda3");
    //console.log(aux.length);
    var filtro = (<HTMLInputElement>aux.item(aux.length-1)).value;
    var aux2 = document.getElementsByName("textInput3");

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
    if(this.isAproforma){
       this.alertController.create({
        subHeader: 'Cantidad de '+ obj.nombre,
        inputs:[{
              name:'number',
              placeholder: '0',
              type: 'number',
              min: '0',
          }],
        buttons: [
          {
            text: 'Aceptar',
             handler: async data =>{
              this.proforma.articulosCant.push(parseInt(data.number));
              this.proforma.articulosNombres.push(obj.nombre);
              this.proforma.articulosPrecios.push(parseInt(obj.precio));
              this.proforma.articulosids.push(obj.id);
              await this.storage.set('proforma', this.proforma);
              await this.storage.set('paso', this.paso+1);
              this.router.navigate(['crear-proforma',{paso: this.paso+1}])
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
    else{
      this.itempicked = obj;
      this.almacenes = this.almacenes.filter(almacen => this.itempicked.almacenesKeys.includes(almacen.idDb) );  
    }
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
      this.venta.articulosCant.push(cantTotal);
      this.venta.articulosCantCadaLocal.push(this.almacenesCant);
      this.venta.articulosLocalesKeys.push(this.almacenesKeys);
      this.venta.articulosDescuentos.push(this.descuentoItem);      
      this.venta.articulosCostoInversion.push(this.itempicked.costoInversion);
      this.venta.articulosPrecios.push(this.itempicked.precio);
      this.venta.articuloskeys.push(this.itempicked.idDb);
      this.items.push (this.itempicked);
      this.itempicked = undefined;
      await this.storage.set('venta', this.venta);
      await this.storage.set('items', this.items);
      await this.storage.set('paso', this.paso+1);
      this.router.navigate(['nueva-venta',{paso: this.paso+1}])
    }
    
  }

 async getDataStorageProforma () {
  await this.storage.get('proforma').then((proforma) => {
    this.proforma = proforma;
  });
  await this.storage.get('paso').then((numero) => {
    this.paso = numero;
  });
 }
 
  async getDataStorage2(){
    await this.storage.get('venta').then((venta) => {
      this.venta = venta;
    });
    await this.storage.get('paso').then((numero) => {
      this.paso = numero;
    });
    if(this.venta.articuloskeys.length >0)
      await this.storage.get('items').then((item) => {
        this.items = item
      });
  }

}
