import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Cotizacion, firebaseUrls, Mes, Modelo3d, Parte, Venta } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api-firebase.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-venta',
  templateUrl: './venta.page.html',
  styleUrls: ['./venta.page.scss'],
})
export class VentaPage implements OnInit {
  public modelos : Modelo3d[];
  public partes : [Parte[]] ;
  public auxPartes : Parte[];
  public donwloadingDataB = true;
  public nextId =1;
  public ventas: Venta[];
  public meses: Mes[];

  constructor( private storage: Storage, public alertController: AlertController, private router: Router ,  private apiService:  ApiService ) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getVentas();
  }
  
  async getMeses(){
    this.apiService.getAll(firebaseUrls.meses).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.meses =data;
      this.donwloadingDataB = false;
    })
  }
  
  async getVentas(){
    this.apiService.getAll(firebaseUrls.ventas).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(async data =>{
      this.ventas =data;
      if(this.ventas != undefined && this.ventas.length >0 ){
        this.ventas.reverse();
        this.nextId = this.ventas[0].id +1;
      }
      await this.getMeses();
    })
  }

  async navegarCreate(){
    await this.storage.create();
    await this.storage.set('venta', {id :this.nextId});
    this.router.navigate(['crear-venta',{createVenta: this.nextId}]);
  }

  async verCliente(idClient: string , nombreVenta : string){
    if(idClient == "Pagina Web")
      this.alertController.create({
        subHeader: 'La venta ' + nombreVenta + ' pertenece a la tienda!.' ,
        buttons: [
          {
            text: 'Cerrar', 
          },
        ]
      }).then(res => {
        res.present();
      });
    else{
      await this.storage.create();
      await this.storage.set('verClient-Key', idClient);
      this.router.navigate(['ver-cliente',{verClient: idClient}]);
    }
  }
  getVentaModelosCantidad(venta:Venta){
    if(venta.keysModelo3D[0]=='Empty')
      return 0;
    else return venta.keysModelo3D.length;
  }
  
  async verVenta(venta : Venta){
    await this.storage.create();
    await this.storage.set('venta', venta);
    this.router.navigate(['ver-venta',{verVenta: venta.id}]);
  }

  deleteVenta(venta : Venta){
    if(venta.seEntrego)
      this.alertController.create({
        subHeader: 'No se puede borrar una venta entregada!.'  ,
        buttons: [
          {
            text: 'Cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
    else
      this.alertController.create({
        subHeader: 'Esta seguro que desea borrar la venta?'  ,
        buttons: [
          {
            text: 'Aceptar',
              handler: async () => {
                this.donwloadingDataB = true;
                await  this.setModelosVenta(venta , false);
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

  async setModelosVenta(venta : Venta , changeEstado : boolean){
    this.modelos = [];
    if(venta.keysModelo3D[0] != 'Empty')
      venta.keysModelo3D.forEach( async key =>{
        await this.getModel2(key , venta , changeEstado);
      })
    else
      if(!changeEstado)
        this.borrarTodoDeVenta(venta);
  }
  async getModel2( key : string , venta : Venta , changeEstado :boolean){
    let aux = this.apiService.getOne(firebaseUrls.modelo3dVendido , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( async data => {
      this.modelos.push(data);
      if(this.modelos.length == venta.keysModelo3D.length)
        if( changeEstado )
          await this.setPartesModel(0)
        else 
          await this.borrarTodoDeVenta(venta)
      aux.unsubscribe();
    });   
  }
  async setPartesModel(pos : number){
    if( this.modelos.length != pos){
      this.auxPartes = [];
      this.modelos[pos].keysParte.forEach( async key =>{
        await this.getParte2(key , this.modelos[pos].keysParte.length , pos) 
      })
    }
    else{
      this.cambiarEstadoPartesModelo();
    }
  }
  async getParte2( key : string , largo : number , pos : number){
    let aux = this.apiService.getOne(firebaseUrls.partesVendidas , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( async data => {
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

  /*
  async getModelos(venta : Venta): Promise<Modelo3d[]>{
    var auxModels3d : Modelo3d [] = [];
    venta.keysModelo3D.forEach( async key =>{
      auxModels3d.push (await this.getModel(key));
    })
    return auxModels3d;
  }
  async getModel( key : string) : Promise<Modelo3d>{
    var auxModel : Modelo3d;
    let aux = this.apiService.getOne(firebaseUrls.modelo3dVendido , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      auxModel = data;
      aux.unsubscribe()
    });
    if(aux.closed)
      return auxModel;
  }

  async getPartes(model3d : Modelo3d): Promise<Parte[]>{
    var auxPartes : Parte [] = [];
    model3d.keysParte.forEach( async key =>{
      auxPartes.push (await this.getParte(key));
    })
    return auxPartes;
  }
  async getParte( key : string) : Promise<Parte>{
    var auxParte : Parte;
    let aux = this.apiService.getOne(firebaseUrls.partesVendidas , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      auxParte = data;
      aux.unsubscribe()
    });
    if(aux.closed)
      return auxParte;
  }*/

  async borrarTodoDeVenta(venta : Venta){
    if(venta.keysModelo3D[0]!='Empty'){

      this.modelos.forEach( async model =>{
        model.keysParte.forEach(async key =>{
          await this.apiService.remove(firebaseUrls.partesVendidas,key);
        })
          await this.apiService.remove(firebaseUrls.modelo3dVendido,model.idDb);
      })
    }
    await this.apiService.remove(firebaseUrls.ventas, venta.idDb);
    this.donwloadingDataB = false;
  }

  async cambiarEstadoPartesModelo(){
    for (let index = 0; index < this.partes.length; index++) {
      this.partes[index].forEach(async part =>{
        const key = part.idDb;
        part.estado = 2;
        part.cantidadImpresa = part.cantidad;
        delete part.idDb;
        await this.apiService.update(firebaseUrls.partesVendidas, key, part);
    }) 
    }
    this.donwloadingDataB = false;
  }

  alertEntregar(venta : Venta){
    if(venta.keysModelo3D[0] !='Empty'){
      if(venta.seEntrego)
      this.alertController.create({
        subHeader: 'Desea cancelar la entrega de la venta '+ venta.nombre + " ?"  ,
        buttons: [
          {
            text: 'aceptar',
            handler: async () => {
              this.cambiarEntregaEstado(venta);
            }
          },
          {
            text: 'cancelar',
          },
        ]
      }).then(res => {
        res.present();
      });
    else
      this.alertController.create({
        subHeader: 'Desea confirmar la entrega de la cotizacion '+ venta.nombre + " ?"  ,
        buttons: [
          {
            text: 'aceptar',
            handler: async () => {
              this.cambiarEntregaEstado(venta);
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
  }

  async cambiarEntregaEstado(venta : Venta){
    if(venta.seEntrego){
      venta.seEntrego = false
      const key = venta.idDb;
      delete venta.idDb;
      await this.apiService.update(firebaseUrls.ventas, key ,venta);
      await this.restarGanancias(venta); 
    }
    else{
      if(venta.fechaEntrega == "Sin fecha"){
        let d = new Date();
        let date = d.setDate(d.getDate());
        venta.fechaEntrega = new Date(date).toISOString().slice(0, 10);
      }
      venta.seEntrego = true;
      const key = venta.idDb;
      delete venta.idDb;
      await this.apiService.update(firebaseUrls.ventas,key ,venta);
      await this.setModelosVenta(venta , true);
      await this.sumarGanancias(venta); 
    }
  }

  async sumarGanancias(venta : Venta){
    var mesAux : Mes;
    let hayMes = false;
    for (let i = 0; i < this.meses.length; i++){
      if(this.meses[i].fecha == venta.fechaEntrega.slice(0,7)){
        this.meses[i].ganancia = this.meses[i].ganancia + venta.precio+ venta.precioPintado;
        this.meses[i].gastos = this.quitarDecimales(this.meses[i].gastos + venta.costo);
        const key = this.meses[i].idDb;
        mesAux ={
          fecha : this.meses[i].fecha,
          ganancia : this.meses[i].ganancia,
          gastos : this.meses[i].gastos
        }
        hayMes = true;
        await this.apiService.update(firebaseUrls.meses,key ,mesAux );
      }
    }
    if(!hayMes){
      mesAux ={
        fecha : venta.fechaEntrega.slice(0,7),
        ganancia : venta.precio +  venta.precioPintado,
        gastos : venta.costo
      }
      await this.apiService.add(firebaseUrls.meses , mesAux);
    }
  }
  quitarDecimales(num : number){
    if(num<0)
      return 0;
    else{
      var s = num.toString();
      if(s.includes('.')){
        var pos = s.indexOf('.');
        var numStr = s.slice(0, pos+3);
        return Number(numStr);
      }
      else
      return num;
    }
  }
  async restarGanancias(venta : Venta){
    var mesAux : Mes;
    for (let i = 0; i < this.meses.length; i++){
      if(this.meses[i].fecha == venta.fechaEntrega.slice(0,7)){
        this.meses[i].ganancia = this.meses[i].ganancia - venta.precio-venta.precioPintado;
        this.meses[i].gastos = this.quitarDecimales(this.meses[i].gastos - venta.costo);
        const key = this.meses[i].idDb;
        mesAux ={
          fecha : this.meses[i].fecha,
          ganancia : this.meses[i].ganancia,
          gastos : this.meses[i].gastos
        }
        await this.apiService.update(firebaseUrls.meses,key ,mesAux );
      }
    }
  }

}
