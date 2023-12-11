import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { map } from 'rxjs';
import { firebaseUrls, Modelo3d, Parte } from 'src/app/models';
import { ApiService } from 'src/app/services/api-firebase.service';

@Component({
  selector: 'app-partes',
  templateUrl: './partes.page.html',
  styleUrls: ['./partes.page.scss'],
})
export class PartesPage implements OnInit {
  public modelo3DActual : Modelo3d;
  public nextId =1;
  public price = 0;
  public costo = 0;
  public totalFilamento = 0;
  public totalResina = 0;
  public horasFilamento = 0;
  public horasResina = 0;
  public partes : Parte[]= [];
  public donwloadingDataB = true;


  constructor( private storage: Storage, public alertController: AlertController, private router: Router ,  private apiService:  ApiService) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getDataStorage();
  }
  forceBack(){
    this.router.navigate(['modelo3d',{volverAModel: this.modelo3DActual.id + this.nextId }]);
  }
  async navegarCreate(){
    await this.storage.set('modelo3D', this.modelo3DActual);
    await this.storage.set('parte', {id : this.nextId });
    this.router.navigate(['crear-parte',{createParte: this.nextId}]);
  }
  async navergarVerParte(parte : Parte){
    await this.storage.set('verParte', parte);
    await this.storage.set('modelo3D', this.modelo3DActual);
    this.router.navigate(['ver-parte',{verParte: parte.id}]);
  }

  async getDataStorage(){
    await this.storage.get('keymodelo3D').then( async (key) => {
      await this.subModelo(key)
    });
  }

  async subModelo(key : string){
    this.apiService.getOne(firebaseUrls.modelo3d, key).snapshotChanges().pipe(
        map(c=>  ({
          idDb: c.payload.key, ... c.payload.val()
        })) 
      )
      .subscribe( async data => {
        this.modelo3DActual = data;
        this.price = this.modelo3DActual.precio;
        this.costo = this.modelo3DActual.costo;
        this.setKeyPartes(this.modelo3DActual);
      })
  }
  
  
  async calcularCostoTotal(){
    var precioTotal = 0;
    var costoTotal = 0;
    this.partes.forEach(part => {
      precioTotal = precioTotal+ (part.precio*part.cantidad);
      costoTotal = costoTotal+ (part.costo*part.cantidad);
    });
    precioTotal = Math.ceil(precioTotal);
    costoTotal =  Math.ceil(costoTotal);
    this.price = precioTotal;
    this.costo = costoTotal;
    this.modelo3DActual.precio = precioTotal;
    this.modelo3DActual.costo = costoTotal;
    var auxModelo : Modelo3d;
    auxModelo ={
      id : this.modelo3DActual.id,
      nombre : this.modelo3DActual.nombre,
      precio : this.modelo3DActual.precio,
      costo : this.modelo3DActual.costo,
      keysParte : this.modelo3DActual.keysParte,
    }
    await this.apiService.update(firebaseUrls.modelo3d, this.modelo3DActual.idDb, auxModelo);
    this.alertController.create({
      subHeader: 'Se calculo correctamente los datos del modelo3D!'  ,
      buttons: [
        {
          text: 'cerrar',
        },
      ]
    }).then(res => {
      res.present();
    });

  }
  async alertEliminarParte(parte : Parte, index : number){
    this.alertController.create({
      subHeader: 'Seguro que deseas borrar la parte: ' + parte.nombre  ,
      buttons: [
        {
          text: 'aceptar',
          handler: async () => {
            this.borrarParte(parte.idDb, index);
          }
        },
        {
          text: 'cancelar',
        },
      ]
    }).then(res => {
      res.present();
    });
  }
  async borrarParte(keyParte: string , pos : number){
    var auxModel : Modelo3d;
    if(this.modelo3DActual.keysParte.length==1)
      this.modelo3DActual.keysParte = ['Empty'];
    else{
      const index = this.modelo3DActual.keysParte.indexOf(keyParte);
      if (index > -1) { 
        this.modelo3DActual.keysParte.splice(index, 1);
      }
    }
    auxModel = {
      id : this.modelo3DActual.id,
      nombre : this.modelo3DActual.nombre,
      costo : this.modelo3DActual.costo,
      keysParte : this.modelo3DActual.keysParte,
      precio : this.modelo3DActual.precio,
    }
    this.partes.splice(pos, 1);
    await this.apiService.update(firebaseUrls.modelo3d, this.modelo3DActual.idDb , auxModel );
    await this.apiService.remove(firebaseUrls.partes , keyParte);
  }

  async setKeyPartes(model3d : Modelo3d){
    this.partes = [];
    this.totalResina = 0;
    this.totalFilamento = 0;
    this.horasFilamento = 0;
    this.horasResina = 0;
    if(model3d.keysParte[0] != "Empty"){
      this.nextId = model3d.keysParte.length +1;
      model3d.keysParte.forEach( async key =>{
        await this.getParte(key , model3d.keysParte.length);
      })
    }
    else this.donwloadingDataB = false;

  }
  async getParte( key : string , largo : number){
    let aux = this.apiService.getOne(firebaseUrls.partes , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      if(data.material == 'Filamento' ){
        this.totalFilamento = this.totalFilamento + data.gramos;
        this.horasFilamento = this.horasFilamento + data.horasDeImpresion;
      }
      else{
        this.totalResina = this.totalResina + data.gramos;
        this.horasResina = this.horasResina + data.horasDeImpresion;
      }
      this.partes.push(data);
      if(this.partes.length == largo)
        this.donwloadingDataB = false;
      aux.unsubscribe();
    });   
  }
  
  /*
  alertaEditPrice(){
  if(this.inputPrice != this.cotizacionActual.precio )
    this.alertController.create({
      subHeader: 'Cambiar el precio de la cotizacion de ' + this.cotizacionActual.precio + ' a ' + this.inputPrice + '?'  ,
      buttons: [
        {
          text: 'aceptar',
          handler: async () => {
            await this.editPrice();
          }
        },
        {
          text: 'cancelar',
        },
      ]
    }).then(res => {
      res.present();
    });
  }
  async alertaEditPricePintado(){
    if(this.inputPricePintado != this.cotizacionActual.precioPintado )
      this.alertController.create({
        subHeader: 'Cambiar el precio del pintado de la cotizacion de ' + this.cotizacionActual.precioPintado + ' a ' + this.inputPricePintado + '?'  ,
        buttons: [
          {
            text: 'aceptar',
            handler: async () => {
              await this.editPricePintado();
            }
          },
          {
            text: 'cancelar',
          },
        ]
      }).then(res => {
        res.present();
      });
  }
  async editPricePintado(){
    var cotizacion : Cotizacion;
    this.cotizacionActual.precioPintado = this.inputPricePintado;
    cotizacion = this.cotizacionActual;
    delete cotizacion.idDb;
    await this.apiService.update(firebaseUrls.cotizaciones, this.keyCotizacion, cotizacion);
    this.alertController.create({
        subHeader: 'Se actualizo correctamente los datos de la cotizacion!'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
  }

  async editPrice(){
    var cotizacion : Cotizacion;
    this.cotizacionActual.precio = this.inputPrice;
    cotizacion = this.cotizacionActual;
    delete cotizacion.idDb;
    await this.apiService.update(firebaseUrls.cotizaciones, this.keyCotizacion, cotizacion);
    this.alertController.create({
        subHeader: 'Se actualizo correctamente los datos de la cotizacion!'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
  }
  quitarDecimales(num : number){
    var s = num.toString();
    if(s.includes('.')){
      var pos = s.indexOf('.');
      var numStr = s.slice(0, pos+3);
      return Number(numStr);
    }
    else
     return num;
  }
  async sendToPrint(part : Parte){
    part.estado = 1;
    const key = part.idDb;
    delete part.idDb;
    await this.apiService.update(firebaseUrls.partes, key, part);
    this.alertController.create({
      subHeader: 'La parte se mando a cola de impresion!'  ,
      buttons: [
        {
          text: 'cerrar',
        },
      ]
    }).then(res => {
      res.present();
    });
  }

  isPrinting(name: string){
    this.alertController.create({
      subHeader: 'La parte '+ name + " se esta imprimiendo!"  ,
      buttons: [
        {
          text: 'cerrar',
        },
      ]
    }).then(res => {
      res.present();
    });
  }
  isPrinted(part: Parte){
    if(this.cotizacionEntregada)
      this.alertController.create({
        subHeader: "No se puede modificar una cotizacion entregada!"  ,
        buttons: [
          {
            text: 'aceptar',
            
          },
        ]
      }).then(res => {
        res.present();
      });
    else
      this.alertController.create({
        subHeader: 'La parte '+ part.nombre + " ya esta impresa!. Desa invalidar estas impresiones?"  ,
        buttons: [
          {
            text: 'aceptar',
            handler: async () => {
              this.canelarImpresion(part);
            }
          },
          {
            text: 'cancelar',
          },
        ]
      }).then(res => {
        res.present();
      });
  }

  async canelarImpresion(part : Parte){
    part.estado = 0;
    part.cantidadImpresa = 0;
    const key = part.idDb;
    delete part.idDb;
    await this.apiService.update(firebaseUrls.partes, key , part);
  }
  
  */

}
