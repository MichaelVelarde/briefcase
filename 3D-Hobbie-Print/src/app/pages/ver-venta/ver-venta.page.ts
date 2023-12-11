import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { map } from 'rxjs';
import { firebaseUrls, Modelo3d, Parte, Venta } from 'src/app/models';
import { ApiService } from 'src/app/services/api-firebase.service';

@Component({
  selector: 'app-ver-venta',
  templateUrl: './ver-venta.page.html',
  styleUrls: ['./ver-venta.page.scss'],
})
export class VerVentaPage implements OnInit {
  public entregada = false;
  public venta: Venta;
  public modelos : Modelo3d[];
  public modelosIds : number[];
  public partes : [Parte[]] ;
  public auxPartes : Parte[];
  public priceVenta=0;
  public costoVenta=0;
  public prices : number[]=[];
  public costos : number[]=[];
  public totalFilamentos : number[]=[];
  public horasFilamentos : number[]=[];
  public totalResinas : number[]=[];
  public horasResinas : number[]=[];
  public pos = 0;
  public donwloadingDataB = true;

  constructor( private storage: Storage, public alertController: AlertController, private router: Router ,  private apiService:  ApiService) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getDataStorage();
  }
  forceBack(){
    this.router.navigate(['venta',{volverAVentas: this.venta.id }]);
  }
  changeModel(){
    var aux = document.getElementsByName("modelPos");
    var index = Number((<HTMLInputElement>aux.item(aux.length-1)).value);
    this.pos=index;
  }

  async addModel3D(){
    await this.storage.create();
    await this.storage.set('venta', this.venta);
    if(this.venta.keysModelo3D[0] == "Empty")
      this.modelosIds =[];
    await this.storage.set('modelId', this.modelosIds);
    this.router.navigate(['add-model3d',{nextModel3d: this.modelosIds.length}]);
  }

  async getDataStorage(){
    await this.storage.get('venta').then( async (venta) => {
      this.venta = venta;
      this.entregada = this.venta.seEntrego;
      if(this.venta.keysModelo3D[0] != "Empty")
        await this.setModelosVenta(this.venta);
      else
        this.donwloadingDataB = false
    });
  }
  async navergarVerParte(parte : Parte){
    await this.storage.set('verParte', parte);
    await this.storage.set('modelo3D', this.modelos[this.pos]);
    this.router.navigate(['ver-parte',{verParteVendida: parte.id , SeEntrego: this.venta.seEntrego}]);
  }

  async setModelosVenta(venta : Venta){
    this.modelos = [];
    this.modelosIds =[];
    venta.keysModelo3D.forEach( async key =>{
      await this.getModel(key , venta.keysModelo3D.length);
    })
   
  }
  async calcularPriceVenta(){
    this.priceVenta = 0;
    this.costoVenta = 0
    for (let index = 0; index < this.prices.length; index++) {
      this.priceVenta = this.priceVenta +this.prices[index];
      this.costoVenta = this.costoVenta +this.costos[index];
    }
    if(this.venta.costo != this.costoVenta){
      console.log("entree")
      this.venta.costo = this.costoVenta;
      this.venta.precio = this.priceVenta;
      var auxVenta :Venta;
      auxVenta ={
        id : this.venta.id,
        nombre : this.venta.nombre,
        precio : this.venta.precio,
        costo : this.venta.costo,
        factura : this.venta.factura,
        fechaEntrega : this.venta.fechaEntrega,
        keyCliente : this.venta.keyCliente,
        seEntrego : this.venta.seEntrego,
        precioPintado : this.venta.precioPintado,
        realizadaPor : this.venta.realizadaPor,
        keysModelo3D : this.venta.keysModelo3D
      }
      await this.apiService.update(firebaseUrls.ventas , this.venta.idDb, auxVenta)
    }
    else this.priceVenta = this.venta.precio;

  }

  async getModel( key : string , largo : number){
    let aux = this.apiService.getOne(firebaseUrls.modelo3dVendido , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( async data => {
      this.prices.push(data.precio);
      this.costos.push(data.costo);
      this.modelos.push(data);
      this.modelosIds.push(data.id);
      if(this.modelos.length == largo)
        await this.setPartesModel(0)
      aux.unsubscribe();
    });   
  }

  async setPartesModel(pos : number){
    if( this.modelos.length != pos){
      
      this.auxPartes = [];
      this.totalFilamentos[pos] =0;
      this.horasFilamentos[pos] =0;
      this.totalResinas[pos] =0;
      this.horasResinas[pos] =0;
      this.modelos[pos].keysParte.forEach( async key =>{
        await this.getParte(key , this.modelos[pos].keysParte.length , pos) 
      })
    }
    else{
      this.calcularPriceVenta();
      this.donwloadingDataB = false; 
    }
      
  }

  async getParte( key : string , largo : number , pos : number){
    let aux = this.apiService.getOne(firebaseUrls.partesVendidas , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( async data => {
      if(data.material == 'Filamento' ){
        this.totalFilamentos[pos] = this.totalFilamentos[pos] + data.gramos;
        this.horasFilamentos[pos] = this.horasFilamentos[pos] + data.horasDeImpresion;
      }
      else{
        this.totalResinas[pos] = this.totalResinas[pos] + data.gramos;
        this.horasResinas[pos] = this.horasResinas[pos] + data.horasDeImpresion;
      }
      this.auxPartes.push(data);
      
      if(largo == this.auxPartes.length){
        if(pos == 0)
          this.partes = [this.auxPartes];
        else  
          this.partes.push(this.auxPartes);
        await this.setPartesModel(pos+1);
      }
      aux.unsubscribe();
    });   
  }


  async calcularCostoTotal(){
    var precioTotal = 0;
    var costoTotal = 0;
    this.partes[this.pos].forEach(part => {
      precioTotal = precioTotal+ (part.precio*part.cantidad);
      costoTotal = costoTotal+ (part.costo*part.cantidad);
    });
    precioTotal = Math.ceil(precioTotal);
    costoTotal =  Math.ceil(costoTotal);
    if(precioTotal!=this.prices[this.pos]){
      this.prices[this.pos] = precioTotal;
      this.costos[this.pos] = costoTotal;
      this.modelos[this.pos].precio = precioTotal;
      this.modelos[this.pos].costo = costoTotal;
      var auxModelo : Modelo3d;
      this.calcularPriceVenta();
      auxModelo ={
        id : this.modelos[this.pos].id,
        nombre : this.modelos[this.pos].nombre,
        precio : this.modelos[this.pos].precio,
        costo : this.modelos[this.pos].costo,
        keysParte : this.modelos[this.pos].keysParte,
      }

      await this.apiService.update(firebaseUrls.modelo3dVendido, this.modelos[this.pos].idDb, auxModelo);
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
  }
  async alertEliminarParte(parte : Parte , index : number){
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

  alertaEditPrice(){
   this.alertController.create({
      subHeader: 'El precio actual de la venta es  ' + this.priceVenta + ', introduce el nuevo precio: '  ,
      inputs:[{
            name:'number',
            placeholder: '0',
            type: 'number',
            min: '1',
        }],
      buttons: [
        {
          text: 'Aceptar',
          handler: async data =>{
            await this.editPrice(parseInt(data.number), false);
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
  alertaEditPricePintado(){
    this.alertController.create({
      subHeader: 'El precio de pintado de la venta es  ' + this.venta.precioPintado + ', introduce el nuevo precio de pintado: '  ,
      inputs:[{
            name:'number',
            placeholder: '0',
            type: 'number',
            min: '1',
        }],
      buttons: [
        {
          text: 'Aceptar',
          handler: async data =>{
            await this.editPrice(parseInt(data.number), true);
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

  async editPrice(precio : number , pintado :boolean){
    if(!pintado){
      this.priceVenta = precio;
      this.venta.precio = precio;
    }
    else
      this.venta.precioPintado = precio;
    var auxVenta :Venta;
    auxVenta ={
      id : this.venta.id,
      nombre : this.venta.nombre,
      precio : this.venta.precio,
      costo : this.venta.costo,
      factura : this.venta.factura,
      fechaEntrega : this.venta.fechaEntrega,
      keyCliente : this.venta.keyCliente,
      seEntrego : this.venta.seEntrego,
      precioPintado : this.venta.precioPintado,
      realizadaPor : this.venta.realizadaPor,
      keysModelo3D : this.venta.keysModelo3D
    }
    await this.apiService.update(firebaseUrls.ventas , this.venta.idDb, auxVenta).then( ()=>{
      this.alertController.create({
        subHeader: 'Se actualizo los datos de la venta!'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
    })
    
  }

  async borrarParte(keyParte: string , i : number){
    var auxModel : Modelo3d;
    if(this.modelos[this.pos].keysParte.length==1)
      this.modelos[this.pos].keysParte = ['Empty'];
    else{
      const index = this.modelos[this.pos].keysParte.indexOf(keyParte);
      if (index > -1) { 
        this.modelos[this.pos].keysParte.splice(index, 1);
      }
    }
    auxModel = {
      id : this.modelos[this.pos].id,
      nombre : this.modelos[this.pos].nombre,
      costo : this.modelos[this.pos].costo,
      keysParte : this.modelos[this.pos].keysParte,
      precio : this.modelos[this.pos].precio,
    }
    this.partes[this.pos].splice(i, 1);
    await this.apiService.update(firebaseUrls.modelo3dVendido, this.modelos[this.pos].idDb , auxModel );
    await this.apiService.remove(firebaseUrls.partesVendidas , keyParte);
  }
  

  async sendToPrint(part : Parte){
    part.estado = 1;
    await this.apiService.update(firebaseUrls.partesVendidas, part.idDb, this.getParteIdentificado(part));
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
    if(this.venta.seEntrego)
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
    part.cantidadImpresa= 0;
    part.estado =0;
    await this.apiService.update(firebaseUrls.partesVendidas, part.idDb , this.getParteIdentificado(part));
  }
  getParteIdentificado(part :Parte):Parte{
    var auxParte : Parte;
    auxParte={
      id : part.id,
      nombre : part.nombre,
      material : part.material,
      costoMaterial : part.costoMaterial,
      costo : part.costo,
      cantidad : part.cantidad,
      cantidadImpresa : part.cantidadImpresa,
      precio : part.precio,
      soporte : part.soporte,
      dimensiones : part.dimensiones,
      detalles : part.detalles,
      escala : part.escala,
      gramos : part.gramos,
      horasDeImpresion : part.horasDeImpresion,
      estado : part.estado
    }
    return auxParte;
  }

}
