import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { CuentaEmpresa, firebaseUrls, GastoExtra, Mes } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { LoginUserService } from 'src/app/services/login-user.service';

@Component({
  selector: 'app-nuevo-gasto-extra',
  templateUrl: './nuevo-gasto-extra.page.html',
  styleUrls: ['./nuevo-gasto-extra.page.scss'],
})
export class NuevoGastoExtraPage implements OnInit {
  public gasto : GastoExtra;
  public descripcion = '';
  public costo = '';
  public meses : Mes[];
  

  constructor(private loginService : LoginUserService, private router: Router,private alertController: AlertController,private apiService : ApiService) { }

  async ngOnInit() {
    await this.getMeses(); 
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

  async saveGasto(){
    if(this.descripcion == "" || this.costo == ""){
      alert("Debes llenar todos los datos.");
    }
    else{
      let d = new Date();
      let date = d.setDate(d.getDate());
      let activeUser = this.loginService.getUsuario();
      this.gasto = {
        creador: activeUser.user,
        descripcion: this.descripcion, 
        costo: this.costo,
        date: new Date(date).toISOString().slice(0, 10),
      };
      await this.descontarGasto(this.gasto);
      await this.actualizarCuentaEmpresa(this.gasto);
      this.apiService.addLog('Agrego el gasto: ' + this.gasto.descripcion);
      await this.apiService.add(firebaseUrls.gastosExtra, this.gasto).then( ()=>{
        this.alertController.create({
          subHeader: 'el gasto extra se creo correctamente!'  ,
          buttons: [
            {
              text: 'Continuar',
              handler: () => {
                this.router.navigate(['gastos-extra',{nAlmacen: this.gasto.descripcion}])
              }
            },
          ]
        }).then(res => {
          res.present();
        });
      })
      
    }
  }
  async descontarGasto(gasto : GastoExtra){
    let hayMes = false;
    for (let i = 0; i < this.meses.length; i++){
      if(this.meses[i].date == gasto.date.slice(0,7)){
        this.meses[i].gananciasMes =""+ ( parseInt(this.meses[i].gananciasMes)  - parseInt(gasto.costo));
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
        date : gasto.date.slice(0,7),
        gananciasMes : '-'+gasto.costo,
        inversion : '0'
      }
      await this.apiService.add(firebaseUrls.meses , nuevoMes);
    }
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
      cuentaEmpresa.fondos = cuentaEmpresa.fondos-parseInt(gasto.costo);
      await this.apiService.update(firebaseUrls.cuentaEmpresa,'-NBQPOCaRtWpyQMpJuuP' , {
      fondos : cuentaEmpresa.fondos,
      });
    })
  }

}
