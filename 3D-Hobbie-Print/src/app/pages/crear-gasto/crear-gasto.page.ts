import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Constantes, firebaseUrls, GastoExtra, Mes } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-crear-gasto',
  templateUrl: './crear-gasto.page.html',
  styleUrls: ['./crear-gasto.page.scss'],
})
export class CrearGastoPage implements OnInit {
  public gasto : GastoExtra;
  public inputGasto = 0;
  public descripcion = ""; 
  public socios = ["Empresa"];
  public meses : Mes[];
  public donwloadingDataB = true;

  constructor(private apiService:  ApiService,public alertController: AlertController, private router: Router,private storage: Storage) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getDataStorage();
  }
  async getDataStorage(){
    await this.storage.get('gastoExtra').then(async (gasto) => {
      this.gasto = gasto;
      await this.getMeses();
    });
  }
  async getConstantes(){
    var constantes : Constantes;
    const sub = this.apiService.getOne(firebaseUrls.constantes, firebaseUrls.keyConstantes).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( data => {
      constantes = data;
      this.socios = this.socios.concat(constantes.socios);
      this.donwloadingDataB = false;
      sub.unsubscribe();
    })
  }
  async agregarGastoExtra(){
    if(this.descripcion == "" || this.inputGasto == 0)
      this.alertController.create({
        subHeader: 'Debe llenar todos los campos'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
    else{
      this.gasto.descripcion = this.descripcion;
      this.gasto.gasto = this.inputGasto;
      var aux = document.getElementsByName("prestadorSocio");
      var valorPrestador = (<HTMLInputElement>aux.item(aux.length-1)).value;
      this.gasto.prestador = valorPrestador;
      let d = new Date();
      let date = d.setDate(d.getDate());
      this.gasto.fecha = new Date(date).toISOString().slice(0, 10);
      await this.sumargasto(this.gasto);
      await this.apiService.add(firebaseUrls.gastosExtra, this.gasto ).then((data) => {
        this.alertController.create({
          subHeader: 'El gasto se creo correctamente!'  ,
          buttons: [
            {
              text: 'Continuar',
              handler: () => {
                this.gasto.id = this.gasto.id +1;
                this.router.navigate(['gastos-extra',{nVenta: this.gasto.id}])
              }
            },
          ]
        }).then(res => {
          res.present();
        });
        
      });
    }
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
  async sumargasto(gasto : GastoExtra){
    var mesAux : Mes;
    let hayMes = false;
    for (let i = 0; i < this.meses.length; i++){
      if(this.meses[i].fecha == gasto.fecha.slice(0,7)){
        this.meses[i].gastos = this.quitarDecimales(this.meses[i].gastos + gasto.gasto);
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
        fecha : gasto.fecha.slice(0,7),
        ganancia : 0,
        gastos : gasto.gasto
      }
      await this.apiService.add(firebaseUrls.meses , mesAux);
    }
  }
  
  async getMeses(){
    this.apiService.getAll(firebaseUrls.meses).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(async data =>{
      this.meses =data;
      await this.getConstantes();
    })
  }
  

}
