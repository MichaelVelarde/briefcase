import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs';
import { Constantes, firebaseUrls, Mes } from 'src/app/models';
import { ApiService } from 'src/app/services/api-firebase.service';

@Component({
  selector: 'app-datos-empresa',
  templateUrl: './datos-empresa.page.html',
  styleUrls: ['./datos-empresa.page.scss'],
})
export class DatosEmpresaPage implements OnInit {
  public donwloadingDataB = true;
  public num = [100,20,50];
  public constantes : Constantes;
  public meses : Mes[];

  constructor( public alertController: AlertController, private router: Router ,  private apiService:  ApiService) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getMeses();
  }

  async getConstantes(){
    const sub =  this.apiService.getOne(firebaseUrls.constantes, firebaseUrls.keyConstantes).snapshotChanges().pipe(
      map(c=>  ({
        idDb: c.payload.key, ... c.payload.val()
      })) 
    )
    .subscribe( async data => {
      this.constantes = data;
      this.donwloadingDataB = false;
      sub.unsubscribe();
    })
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

  async getMeses(){
    this.apiService.getAll(firebaseUrls.meses).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe( async data => {
      this.meses = data;
      this.meses = this.meses.reverse();
      await this.getConstantes();
    })
  }
  agregarCostoMaterial(){
    this.constantes.costosMateriales.push(0);
  }
  agregarSocio(){
    this.constantes.socios.push("");
  }
  async actualizarDatos(){
    var datosCorrectos = true;
    if(this.constantes.correa>0 && this.constantes.heatbed>0 && this.constantes.imprevistos>0
      && this.constantes.inversion > 0 && this.constantes.kwH>0 && this.constantes.nozzle >0 
      && this.constantes.tuboGarganta>0){
        this.constantes.costosMateriales.forEach( costo =>{
          if(costo <= 0)
            datosCorrectos = false
        })
        this.constantes.socios.forEach( socio =>{
          if(socio == "")
            datosCorrectos = false
        })
        if(datosCorrectos){
          await this.apiService.update(firebaseUrls.constantes , firebaseUrls.keyConstantes, this.constantes);
          this.alertController.create({
            subHeader: 'Se actualizo los datos correctamente!'  ,
            buttons: [
              {
                text: 'aceptar',
              },
            ]
          }).then(res => {
            res.present();
          });
        }
    }
    else 
      datosCorrectos = false
    if(!datosCorrectos)
      this.alertController.create({
        subHeader: 'No se pudo actualizar los datos! , valores invalidos!'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
  }
  /*this.alertController.create({
        subHeader: 'Introduce la cantidad que desea restar a la parte: ' + part.nombre ,
        inputs:[{
              name:'number',
              placeholder: '0',
              type: 'number',
              min: '1',
              max: maxCant
          }],
        buttons: [
          {
            text: 'Aceptar',
            handler: async data =>{
              if(parseInt(data.number) > maxCant || data.number == "")
                this.alertController.create({
                  subHeader: 'Cantidad invalida!.' ,
                  buttons: [
                    {
                      text: 'Cerrar', 
                    },
                  ]
                }).then(res => {
                  res.present();
                });*/

  cambiarNombreSocio(index : number){
    this.alertController.create({
      subHeader: 'Introduce el nuevo nombre de ' + this.constantes.socios[index]  ,
      inputs:[{
        name:'socio',
        placeholder: '',
        type: 'text',
      }],
      buttons: [
        {
          text: 'Cerrar',
        },
        {
          text: 'Aceptar',
          handler: data =>{
            if(data.socio != '')
              this.constantes.socios[index] = data.socio
          }
           
        },
      ]
    }).then(res => {
      res.present();
    });
  }
  quitarCostoMaterial(pos : number){
    if(this.constantes.costosMateriales.length > 1)
      this.constantes.costosMateriales.splice(pos,1)
    else
     this.alertController.create({
        subHeader: 'Debe existir como minimo un costo de material!'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
  }

  alertQuitarSocio(pos : number){
    this.alertController.create({
      subHeader: 'Seguro que deseas quitar el socio: ' + this.constantes.socios[pos]  ,
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Aceptar',
          handler: data =>{
           this.quitarSocio(pos)
          }
        },
      ]
    }).then(res => {
      res.present();
    });
  }

  quitarSocio(pos : number){
    if(this.constantes.socios.length > 1)
      this.constantes.socios.splice(pos,1)
    else
     this.alertController.create({
        subHeader: 'Debe existir como minimo un socio!'  ,
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
