import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { throws } from 'assert';
import { map } from 'rxjs/operators';
import { CuentaEmpresa, firebaseUrls, Inventario, Mes, Venta } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { LoginUserService } from 'src/app/services/login-user.service';


@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.page.html',
  styleUrls: ['./nueva-venta.page.scss'],
})
export class NuevaVentaPage implements OnInit {
  public invercion : number;
  public meses : Mes[];
  public venta?: Venta;
  public paso : number = 0;
  public priceCalculed = false;
  public factura = false;
  public interior = false;
  public items = [];
  public nameClient = "Escoge un cliente";

  
  

  constructor(public alertController: AlertController, private router: Router, private storage: Storage, private apiService:  ApiService, private loginService : LoginUserService ) {
    
  }

 async ngOnInit() {
  await this.storage.create();
  await this.getDataStorage();
  await this.getMeses(); 
}

async getDataStorage(){
  await this.storage.get('venta').then((venta) => {
    this.venta = venta;
  });
  if(this.venta.keyCliente != undefined){
    await this.storage.get('client').then((name) => {
      this.nameClient = name
    });
    if(this.venta.articuloskeys.length >0){
      await this.storage.get('items').then((item) => {
        this.items = item;
      });
      await this.storage.get('paso').then((numero) => {
        this.paso = numero;
      });
    }
  }
}
    
async escogerCliente(){
  if(this.venta.keyCliente == undefined)
    this.router.navigateByUrl("/escoger-cliente")
  else{
    await this.storage.set('venta', this.venta );
    await this.storage.set('paso', this.paso +1 );
    this.router.navigate(['escoger-cliente',{paso: this.paso +1}])
  }
    /* this.alertController.create({
        subHeader: 'Si escoge otro cliente los datos de la venta se perderan!'  ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              this.router.navigateByUrl("/escoger-cliente")
            }
          },
          {
            text: 'Cancelar',
            handler: () => {
            }
          },
        ]
      }).then(res => {
        res.present();
      });*/
}
calcularCosto(){
  let auxCosto = 0;
  this.invercion = 0;
  for (let i = 0; i < this.venta.articuloskeys.length; i++){
    auxCosto = auxCosto + (this.venta.articulosCant[i] * parseInt(this.venta.articulosPrecios[i])) - (this.venta.articulosCant[i] * parseInt(this.venta.articulosDescuentos[i]));
    this.invercion = this.invercion + (this.venta.articulosCant[i] * this.venta.articulosCostoInversion[i]);
  }
  this.venta.costo = ""+auxCosto;
  this.venta.factura = this.factura;
  this.venta.interior = this.interior;
  this.priceCalculed = true;
}

async addItem(){
  if(this.venta.articuloskeys.length >0){
    
    await this.storage.set('paso', this.paso +1 );
    this.router.navigate(['escoger-articulo',{paso: this.paso +1}])
  }
  else{
    await this.storage.set('paso', 0);
    this.router.navigate(['escoger-articulo',{paso: 0}])
  }
}

async deleteItem(index : number){
  this.priceCalculed = false;
  this.items.splice(index,1); 
  this.venta.articulosCant.splice(index,1);
  this.venta.articulosCantCadaLocal.splice(index,1); 
  this.venta.articulosCostoInversion.splice(index,1);
  this.venta.articulosDescuentos.splice(index,1);
  this.venta.articulosLocalesKeys.splice(index,1);
  this.venta.articulosPrecios.splice(index,1);
  this.venta.articuloskeys.splice(index,1);
  await this.storage.set('venta', this.venta);
  await this.storage.set('items', this.items);
}
needFacture(){
  if(this.venta.factura)
    return "Si"
  return "No"
}
async agregarVenta(){
  let d = new Date();
  let date = d.setDate(d.getDate());
  let activeUser = this.loginService.getUsuario();
  this.venta.id = parseInt(""+this.venta.id);
  this.venta.date = new Date(date).toISOString().slice(0, 10);
  this.venta.costoEnvio = "0";
  this.venta.seEntrego = false;
  await this.actualizarCuentaEmpresa(this.venta);
  await this.sumarGanancias(this.venta);
  await this.descontarCantidades(this.venta);
  this.venta.vendedor = activeUser.user;
  this.apiService.addLog('Agrego la venta con id: ' +this.venta.id)
  await this.apiService.add(firebaseUrls.ventas, this.venta ).then((data) => {
    this.alertController.create({
      subHeader: 'La venta se creo correctamente!'  ,
      buttons: [
        {
          text: 'Continuar',
          handler: () => {
            this.router.navigate(['ventas',{nVenta: this.venta.id}])
          }
        },
      ]
    }).then(res => {
      res.present();
    });
    
  });
}

async sumarGanancias(venta : Venta){
  let hayMes = false;
  for (let i = 0; i < this.meses.length; i++){
    if(this.meses[i].date == venta.date.slice(0,7)){
      this.meses[i].gananciasMes =""+ ( parseInt(this.meses[i].gananciasMes)   + parseInt(venta.costo));
      this.meses[i].inversion =""+ ( parseInt(this.meses[i].inversion)   + this.invercion);
      hayMes = true;
      await this.apiService.update(firebaseUrls.meses,this.meses[i].id , {
        date : this.meses[i].date,
        gananciasMes : this.meses[i].gananciasMes,
        inversion : this.meses[i].inversion
      });
    }
  }
  if(!hayMes){
    var nuevoMes : Mes;
    nuevoMes ={
      date : venta.date.slice(0,7),
      gananciasMes : venta.costo,
      inversion : ''+this.invercion
    }
    await this.apiService.add(firebaseUrls.meses , nuevoMes);
  }
}
async actualizarCuentaEmpresa(venta : Venta){
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
    cuentaEmpresa.fondos = cuentaEmpresa.fondos+parseInt(venta.costo);
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
async descontarCantidades(venta : Venta){
  for (let i = 0; i < venta.articuloskeys.length; i++){
      await this.descItem(venta , i);
  }
}
async descItem(venta : Venta , pos : number){
  var itemAux : Inventario;
  let aux = this.apiService.getOne(firebaseUrls.inventario , venta.articuloskeys[pos]).snapshotChanges().pipe(
    map(c=>  ({
      id: c.payload.key, ... c.payload.val()
    })) 
  )
  .subscribe( data => {
    itemAux = data;
    aux.unsubscribe();
  }).add( async ()=>{
    for (let j = 0; j < venta.articulosLocalesKeys[pos].length; j++){
      let index = itemAux.almacenesKeys.findIndex(valor => valor == venta.articulosLocalesKeys[pos][j] );
      itemAux.almacenesCantidades[index] = itemAux.almacenesCantidades[index] - venta.articulosCantCadaLocal[pos][j];
    }
    itemAux.cantTotal = itemAux.cantTotal - venta.articulosCant[pos];
    await this.apiService.update(firebaseUrls.inventario,venta.articuloskeys[pos] , itemAux );
  })

}

esInterior(){
  if(this.venta.interior)
    return "Si"
  return "No"
}

}
