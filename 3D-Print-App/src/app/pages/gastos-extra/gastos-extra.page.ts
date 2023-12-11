import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { CuentaEmpresa, firebaseUrls, GastoExtra, Mes , GastoExtraMes } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { LoginUserService } from 'src/app/services/login-user.service';


@Component({
  selector: 'app-gastos-extra',
  templateUrl: './gastos-extra.page.html',
  styleUrls: ['./gastos-extra.page.scss'],
})
export class GastosExtraPage implements OnInit {
  public gastos : GastoExtra[];
  public meses: Mes[];
  public donwloadingDataB = true;
  public activeUserAdmin = false;
  public gastosMeses : GastoExtraMes[];

  constructor(private userService : LoginUserService ,private alertController: AlertController,private router: Router,private apiService : ApiService) { }

  async ngOnInit() {
    this.activeUserAdmin = this.userService.getUsuario().admin;
    await this.getGastos();
    await this.getMeses();
  }

  navegarCreate(){
    this.router.navigate(['nuevo-gasto-extra',{createAlmacen: this.gastos.length}]);
  }
  llenarGastosMeses(){
    this.gastosMeses = [];
    var datea = this.gastos[0].date.substring(0,7);
    var gastoMes = 0;
    for (let i = 0; i < this.gastos.length; i++){
      if( datea ==  this.gastos[i].date.substring(0,7) )
        gastoMes = gastoMes +  parseInt(this.gastos[i].costo);
      else{
        this.gastosMeses.push({date : datea , gasto :  gastoMes})
        datea = this.gastos[i].date.substring(0,7)
        gastoMes = parseInt(this.gastos[i].costo);
      } 
      if( i == this.gastos.length -1)
          this.gastosMeses.push({date : datea , gasto :  gastoMes})  
    }
  }

  async getGastos(){
    const aux = this.apiService.getAll(firebaseUrls.gastosExtra).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.gastos =data;
      aux.unsubscribe();
    }).add( () =>{
      this.gastos.reverse();
      this.llenarGastosMeses();
    });
  }
  async getMeses(){
    const aux = this.apiService.getAll(firebaseUrls.meses).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.meses =data;
      aux.unsubscribe();
    }).add( () =>{
      this.donwloadingDataB = false;
    }); 
  }

  async confirmarBorrarGasto(gasto : GastoExtra){
    await this.alertController.create({
        subHeader: 'Seguro que desea borrar el gasto de: ' +gasto.descripcion  ,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
               this.deleteGasto(gasto);
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

  async deleteGasto(gasto : GastoExtra){
    await this.actualizarCuentaEmpresa(gasto);
    await this.quitarGasto(gasto);
    this.apiService.addLog('Borro el gasto: ' + gasto.descripcion);
    await this.apiService.remove(firebaseUrls.gastosExtra, gasto.idDb ).then((data) => {
      this.alertController.create({
        subHeader: 'El gasto extra se borro correctametne!'  ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              this.getGastos(); 
            }
          },
        ]
      }).then(res => {
        res.present();
      });
      
    });
  }
  async quitarGasto(gasto : GastoExtra){
    const pos = this.meses.findIndex( mes => mes.date == gasto.date.slice(0,7) )
    this.meses[pos].gananciasMes =""+ ( parseInt(this.meses[pos].gananciasMes)   + parseInt(gasto.costo));

    await this.apiService.update(firebaseUrls.meses,this.meses[pos].id , {
      date : this.meses[pos].date,
      gananciasMes : this.meses[pos].gananciasMes,
      inversion : this.meses[pos].inversion
    });
  }

  async actualizarCuentaEmpresa(gasto : GastoExtra){
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
      cuentaEmpresa.fondos = cuentaEmpresa.fondos+parseInt(gasto.costo);
      await this.apiService.update(firebaseUrls.cuentaEmpresa,'-NBQPOCaRtWpyQMpJuuP' , {
      fondos : cuentaEmpresa.fondos,
      });
    })
  }
  /*
  async agregarCreadorAGastos(){
    var key = "";
    var gastoEditable : GastoExtra2;
    var gastosAux = this.gastos;
    var key = ""
    for (var i = 0; i < gastosAux.length; i++) {
      key = gastosAux[i].idDb;
      delete gastosAux[i].idDb;
      gastoEditable = gastosAux[i];
      gastoEditable.creador = 'andres'
      await this.apiService.update(firebaseUrls.gastosExtra ,key, gastoEditable)    
    }
    console.log("all done")
  }*/

}
