import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { map } from 'rxjs/operators';
import { Venta , Mes, Cliente, Inventario, User, firebaseUrls, CuentaEmpresa} from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { LoginUserService } from 'src/app/services/login-user.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
})
export class VentasPage implements OnInit {
  public nextId: number;
  public ventasDb: Venta[];
  public ventasFiltrado?: Venta [] ;
  public meses: Mes[];
  public mesesFilter: Mes[];
  public allMeses = false;
  public clients: Cliente[];
  public donwloadingDataB = true;
  public activeUserAdmin = false;

  constructor( private storage: Storage, public alertController: AlertController, private router: Router , private apiService:  ApiService , private userService : LoginUserService) {
    
  }

   async ngOnInit() {
    this.activeUserAdmin = this.userService.getUsuario().admin;
    this.donwloadingDataB = true;
    await this.getClientes();
    await this.getVentas(); 
    await this.getMeses();
  }
    
  getGananciaNeta(mes : Mes){
   return parseInt(mes.gananciasMes) - parseInt(mes.inversion)
  }
  async navegarCreate(){
    await this.storage.create();
    await this.storage.set('venta', {id : this.nextId});
    this.router.navigate(['nueva-venta',{createVenta: this.nextId}]);
  }
  async navegarProforma(){
    await this.storage.create();
    await this.storage.set('proforma', {nro : this.nextId});
    this.router.navigate(['crear-proforma',{createProforma: this.nextId}]);
  }
 
  //filter for ventas
  search(){
    this.ventasFiltrado =[];
   // var filtro = (<HTMLInputElement>document.getElementById("filtroBusqueda")).value;
    //var inputValue = (<HTMLInputElement>document.getElementById("textInput")).value;

    var aux = document.getElementsByName("filtroBusqueda");
    var filtro = (<HTMLInputElement>aux.item(aux.length-1)).value;
    var aux2 = document.getElementsByName("textInput");
    var inputValue = (<HTMLInputElement>aux2.item(aux2.length-1)).value;

    for (let i = 0; i < this.ventasDb.length; i++){
      //Example need to compere with the keys from clients
      
      if(filtro == "name" && this.findClient(this.ventasDb[i].keyCliente).toLowerCase().includes( inputValue.toLowerCase())){
        this.ventasFiltrado.push(this.ventasDb[i]);
      }
      if(filtro == "id" && this.ventasDb[i].id == parseInt(inputValue) ){
        this.ventasFiltrado.push(this.ventasDb[i]);
      }
    }
  }
  findClient(id : string){
    if(this.clients!= undefined)
    return this.clients.find(x => x.id === id).nombre;
  }

  getMoreMeses(){
    if(!this.allMeses){
      this.allMeses = true;
      this.mesesFilter = this.meses;
    }
    else{
      this.allMeses = false;
      this.mesesFilter = this.meses.slice(0,2);
    }
    
  }
  //get the data from ventas
  async getVentas(){
    const aux = this.apiService.getAll(firebaseUrls.ventas).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDB: c.payload.key , ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.ventasDb =data;
      aux.unsubscribe();
    }).add( () =>{
      if(this.ventasDb[0] != undefined){
        this.ventasDb.reverse();
        this.nextId = this.ventasDb[0].id +1;
        this.ventasFiltrado = this.ventasDb;
        this.ventasFiltrado = this.ventasFiltrado.slice(0 ,100 );
      }
      
    });
  }
  //get meses
  async getMeses(){
    const aux = this.apiService.getAll(firebaseUrls.meses).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.meses =data;
      aux.unsubscribe();
    }).add( () =>{
      this.meses.reverse();
      if(this.meses.length >2)
        this.mesesFilter = this.meses.slice(0,2);
      else
        this.mesesFilter = this.meses;
      this.donwloadingDataB = false;
    }); 
  }
  
  //get clientes
  async getClientes(){
    const aux = this.apiService.getAll(firebaseUrls.clientes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.clients =data;
      aux.unsubscribe();
    })
  }
  borrarVenta(venta : Venta){
    this.alertController.create({
      subHeader: 'Seguro que desea borrar la venta: ' + venta.id ,
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.deleteVenta(venta);
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
 
  async verVenta(venta : Venta){
    await this.storage.create();
    await this.storage.set('venta', venta);
    this.router.navigate(['ver-venta',{id : venta.id}])
  }

  async deleteVenta(venta : Venta){
    await this.descontarGanancias(venta);
    await this.actualizarCuentaEmpresa(venta);
    await this.sumarCant(venta);
    this.apiService.addLog('Borro la venta con id: ' +venta.id)
    await this.apiService.remove(firebaseUrls.ventas, venta.idDB ).then((data) => {
      this.alertController.create({
        subHeader: 'La venta se elimino correctamente!'  ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              this.getVentas(); 
              this.getMeses();
            }
          },
        ]
      }).then(res => {
        res.present();
      });
      
    });
  }

  async descontarGanancias(venta : Venta){
    var invercion = 0;
    const valorTotal = parseInt(venta.costo) - parseInt(venta.costoEnvio);
    for (let i = 0; i < venta.articulosCostoInversion.length; i++){
        invercion = invercion + (venta.articulosCostoInversion[i] * venta.articulosCant[i]);
    }
    const pos = this.meses.findIndex( mes => mes.date == venta.date.slice(0,7) )

    this.meses[pos].gananciasMes =""+ ( parseInt(this.meses[pos].gananciasMes)   - valorTotal);
    this.meses[pos].inversion =""+ ( parseInt(this.meses[pos].inversion)   - invercion);
    await this.apiService.update(firebaseUrls.meses,this.meses[pos].id , {
      date : this.meses[pos].date,
      gananciasMes : this.meses[pos].gananciasMes,
      inversion : this.meses[pos].inversion
    });
  }

  async sumarCant(venta : Venta){
    for (let i = 0; i < venta.articuloskeys.length; i++){
       await this.sumarItem(venta , i);
    } 
  }
  async sumarItem(venta : Venta , pos : number){
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
        itemAux.almacenesCantidades[index] = itemAux.almacenesCantidades[index] + venta.articulosCantCadaLocal[pos][j];
      }
      itemAux.cantTotal = itemAux.cantTotal + venta.articulosCant[pos];
      await this.apiService.update(firebaseUrls.inventario,venta.articuloskeys[pos] , itemAux );
    })
  }
  async actualizarCuentaEmpresa(venta : Venta){
    const valorTotal = parseInt(venta.costo) - parseInt(venta.costoEnvio);
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
      cuentaEmpresa.fondos = cuentaEmpresa.fondos-valorTotal;
      await this.apiService.update(firebaseUrls.cuentaEmpresa,'-NBQPOCaRtWpyQMpJuuP' , {
      fondos : cuentaEmpresa.fondos,
      });
    })
  }
  /*
  async crearCuentaEmpresa(){
    let aux : CuentaEmpresa;
    aux = {
      fondos : 10000
    }
    await this.apiService.add(firebaseUrls.cuentaEmpresa, aux ).then((data) => {
      this.alertController.create({
        subHeader: 'La cuenta empresa se creo!'  ,
        buttons: [
          {
            text: 'Continuar',
          },
        ]
      }).then(res => {
        res.present();
      });
      
    });
  }


  async agregarVendedorVentas(){
    this.donwloadingDataB = true;
    var key = "";
    var ventaAux = this.ventasDb;
    for (var i = 0; i < ventaAux.length; i++) {
      if( i %2 ==0)
        ventaAux[i].vendedor = 'Daniel'
      else
        ventaAux[i].vendedor = 'andres'

      key = ventaAux[i].idDB;
      delete ventaAux[i].idDB;
      await this.apiService.update(firebaseUrls.ventas ,key, ventaAux[i])    
    }
    this.donwloadingDataB = false;
    console.log("all done")
  }
  VerGananciaToatal(){
    var aux = 0;
    for (let i = 0; i < this.ventasDb.length; i++){
      if(this.ventasDb[i].date.includes('2022-08')){
        aux  =  aux + parseInt(this.ventasDb[i].costo)
        aux = aux - parseInt(this.ventasDb[i].costoEnvio)
      }
        
    }
    return aux;
  }*/
}
