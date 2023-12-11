import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { firebaseUrls, GastoExtra, GastoExtraMes, Mes } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { map, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gastos-extra',
  templateUrl: './gastos-extra.page.html',
  styleUrls: ['./gastos-extra.page.scss'],
})
export class GastosExtraPage implements OnInit {
  public donwloadingDataB2 = true;
  public gastosExtra: GastoExtra[];
  public meses: Mes[];
  public mesSub : Subscription;
  public gastosMeses : GastoExtraMes[];
  public nextId= 1;

  constructor(private apiService:  ApiService,public alertController: AlertController, private router: Router,private storage: Storage) { }

  async ngOnInit() {
    this.donwloadingDataB2 = true;
    await this.getGastosExtra();
  }

  async getGastosExtra(){
     const sub= this.apiService.getAll(firebaseUrls.gastosExtra).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe( async data =>{
       this.gastosExtra = data;
       if(this.gastosExtra != undefined && this.gastosExtra.length >0 ){
        this.gastosExtra = this.gastosExtra.reverse();
        this.nextId = this.gastosExtra[0].id +1;
        this.llenarGastosMeses(this.gastosExtra); 
      }
      if(this.mesSub == undefined)
        await this.getMeses();
    })
    
  }

  alertpagarPrestamo(gasto : GastoExtra){
    this.alertController.create({
      subHeader: 'Desea pagar el monto de '+ gasto.gasto +' al socio '+ gasto.prestador + ' ?'  ,
      buttons: [
        {
          text: 'Aceptar',
            handler: async () => {
              await this.pagarPrestamo(gasto);
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
  async pagarPrestamo(gasto : GastoExtra){
    const key =gasto.idDb;
    gasto.prestador = "Empresa";
    delete gasto.idDb;
    await this.apiService.update(firebaseUrls.gastosExtra , key, gasto);
  }

  llenarGastosMeses(gastos : GastoExtra[]){
    this.gastosMeses = [];
    var datea = gastos[0].fecha.substring(0,7);
    var gastoMes = 0;
    for (let i = 0; i < gastos.length; i++){
      if( datea ==  gastos[i].fecha.substring(0,7) )
        gastoMes = gastoMes +  gastos[i].gasto;
      else{
        this.gastosMeses.push({date : datea , gasto :  gastoMes})
        datea = gastos[i].fecha.substring(0,7)
        gastoMes =gastos[i].gasto;
      } 
      if( i == gastos.length -1)
          this.gastosMeses.push({date : datea , gasto :  gastoMes})  
    }
  }

  async navegarCrearGasto(){
    await this.storage.create();
    await this.storage.set('gastoExtra', {id :this.nextId});
    this.router.navigate(['crear-gasto',{nuevoGasto: this.nextId}]);
  }

  alertdeleteGastoExtra(gasto : GastoExtra){
    this.alertController.create({
      subHeader: 'Esta seguro que desea borrar el gasto de monto: '+ gasto.gasto  ,
      buttons: [
        {
          text: 'Aceptar',
            handler: async () => {
              this.donwloadingDataB2 = true;
              await this.quitarGastoMes(gasto);
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
  async getMeses(){
    this.mesSub = this.apiService.getAll(firebaseUrls.meses).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.meses =data;
      this.donwloadingDataB2 = false;
    })
  }
  quitarDecimales(num : number){
    var s = num.toString();
    var pos = s.indexOf('.');
    var numStr = s.slice(0, pos+3);
    return Number(numStr);
  }
  
  async quitarGastoMes(gasto : GastoExtra){
    var mesAux : Mes;
    for (let i = 0; i < this.meses.length; i++){
      if(this.meses[i].fecha == gasto.fecha.slice(0,7)){
        this.meses[i].gastos = this.quitarDecimales(this.meses[i].gastos - gasto.gasto);
        const key = this.meses[i].idDb;
        mesAux ={
          fecha : this.meses[i].fecha,
          ganancia : this.meses[i].ganancia,
          gastos : this.meses[i].gastos
        }
        await this.apiService.remove(firebaseUrls.gastosExtra , gasto.idDb);
        await this.apiService.update(firebaseUrls.meses,key ,mesAux );
      }
    }
  }


}
