import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Almacen, Cliente, CuentaEmpresa, firebaseUrls, Inventario, Mes, Venta } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { sign } from 'crypto';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-venta',
  templateUrl: './ver-venta.page.html',
  styleUrls: ['./ver-venta.page.scss'],
})
export class VerVentaPage implements OnInit {
  public venta?: Venta;
  public cliente: Cliente;
  public meses: Mes[];
  public costoEnvio : number;
  public almacenes : Almacen[];
  public items : Inventario[];
  public donwloadingDataB = true;

  constructor(private router: Router,public alertController: AlertController, private storage: Storage, private apiService:  ApiService) { }

 async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getStorage();
    await this.getcliente(this.venta.keyCliente);
    await this.inicarItems();
    await this.getMeses()
    await this.getAlmacenes();
  }
  async getStorage(){
    await this.storage.get('venta').then((venta) => {
      this.venta = venta;
      this.costoEnvio = venta.costoEnvio;
    });
  }
  entregarVenta(){
    this.venta.seEntrego = true;
  }
  cancelarVenta(){
    this.venta.seEntrego = false;
  }
  async actualizarVenta(){
    await this.restarEnvioMes(this.venta);
    this.venta.costoEnvio = ""+this.costoEnvio;
    let key  = this.venta.idDB;
    delete this.venta.idDB;
    this.apiService.addLog('Edito la venta con id: ' +this.venta.id)
    await this.apiService.update(firebaseUrls.ventas, key, this.venta ).then((data) => {
      this.alertController.create({
        subHeader: 'La venta se actualizo correctamente!'  ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              this.router.navigate(['ventas',{update: this.venta.id}])
            }
          },
        ]
      }).then(res => {
        res.present();
      });
      
    });
  }
  async getAlmacenes(){
    const aux = this.apiService.getAll(firebaseUrls.almacenes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.almacenes =data;
      aux.unsubscribe();
    }).add( ()=>{
      this.donwloadingDataB = false;
    })
  }
  async getcliente(key : string){
    let aux = this.apiService.getOne(firebaseUrls.clientes , key).snapshotChanges().pipe(
      map(c=>  ({
        id: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      this.cliente = data;
      aux.unsubscribe();
    });
  }
  async inicarItems(){
    this.items = [];
    for (let i = 0; i < this.venta.articuloskeys.length; i++){
       await this.getitems(this.venta.articuloskeys[i]);
    } 
  }
  async getitems(key : string){
    let aux = this.apiService.getOne(firebaseUrls.inventario , key).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      this.items.push(data);
      aux.unsubscribe();
    });
  }
  getDescuento(i : number){
    return this.venta.articulosDescuentos[i];
  }
  getCantidadTotal(i : number){
    return this.venta.articulosCant[i];
  }
  getNombreAlmacen(i : number, j : number){
    return this.almacenes.find(almacen => almacen.idDb == this.venta.articulosLocalesKeys[i][j] ).nombre;
  }
  getBool(val : boolean){
    if(val)
      return "Si"
    else
      return "No"
  }

  async restarEnvioMes(venta : Venta){
    let auxCostoEnvio = parseInt(venta.costoEnvio) - this.costoEnvio;
    for (let i = 0; i < this.meses.length; i++){
      if(this.meses[i].date == venta.date.slice(0,7)){
        this.meses[i].gananciasMes =""+ ( parseInt(this.meses[i].gananciasMes) + auxCostoEnvio);
        await this.apiService.update(firebaseUrls.meses,this.meses[i].id , {
          date : this.meses[i].date,
          gananciasMes : this.meses[i].gananciasMes,
          inversion : this.meses[i].inversion
        });
      }
    }
    
  }
  async actualizarCuentaEmpresa(venta : Venta){
    let auxCostoEnvio = parseInt(venta.costoEnvio) - this.costoEnvio;
    var cuentaEmpresa : CuentaEmpresa;
    let aux = this.apiService.getOne(firebaseUrls.cuentaEmpresa , '-NBQPOCaRtWpyQMpJuuP').snapshotChanges().pipe(
      map(c=>  ({
        id: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      cuentaEmpresa = data;
      aux.unsubscribe();
    }).add( async ()=>{
      cuentaEmpresa.fondos = cuentaEmpresa.fondos+auxCostoEnvio;
      await this.apiService.update(firebaseUrls.cuentaEmpresa,'-NBQPOCaRtWpyQMpJuuP' , {
      fondos : cuentaEmpresa.fondos,
      });
    })
  }
  
  async getMeses(){
    const aux = this.apiService.getAll(firebaseUrls.meses).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.meses = data;
      aux.unsubscribe()
    });
  }
}
