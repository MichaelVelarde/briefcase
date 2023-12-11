import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Cotizacion, firebaseUrls, Parte } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-cola-impresion',
  templateUrl: './cola-impresion.page.html',
  styleUrls: ['./cola-impresion.page.scss'],
})
export class ColaImpresionPage implements OnInit {
 
  public partes : Parte[];
  public keyCotizacion : string;
  public donwloadingDataB = true;

  constructor( private storage: Storage, public alertController: AlertController, private router: Router ,  private apiService:  ApiService) { }

  async ngOnInit() {
    await this.getPartes();
  }
  
  async getPartes(){
    this.apiService.getAll(firebaseUrls.partesVendidas).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.partes = data.filter( (part : Parte ) =>{
        if( part.estado == 1)
         return part;
      })
      this.donwloadingDataB = false;
    })
  }
  agregarCantidadImpresa(part : Parte){
    const maxCant = part.cantidad-part.cantidadImpresa;
    this.alertController.create({
      subHeader: 'Introduce la cantidad que desea sumar a la parte: ' + part.nombre ,
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
              });
            else{
                part.cantidadImpresa = part.cantidadImpresa + parseInt(data.number);
                await this.actualizarCantidadImpresa(part)
            }
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

  quitarCantidadImpresa(part : Parte){
    if(part.cantidadImpresa>0){
      const maxCant = part.cantidadImpresa;
      this.alertController.create({
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
                });
              else{
                part.cantidadImpresa = part.cantidadImpresa - parseInt(data.number);
                await this.actualizarCantidadImpresa(part)
              }
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
  }
  async actualizarCantidadImpresa(part : Parte){
    const key = part.idDb;
    delete part.idDb;
    if(part.cantidad == part.cantidadImpresa){
      part.estado = 2;
      this.alertController.create({
        subHeader: 'Termino de impimir la parte ' + part.nombre + '!.' ,
        buttons: [
          {
            text: 'Cerrar', 
          },
        ]
      }).then(res => {
        res.present();
      });
    }
    await this.apiService.update(firebaseUrls.partesVendidas,key,part);
  }
  async navergarVerParte(parte : Parte){
    await this.storage.create();
    await this.storage.set('verParte', parte);
    this.router.navigate(['ver-parte',{verParte: parte.id}]);
  }
  async alertQuitarCola(part : Parte){
    this.alertController.create({
      subHeader: 'Quiere quitar la parte '+ part.nombre + " de la cola de impresiones?"  ,
      buttons: [
        {
          text: 'aceptar',
          handler: async () => {
            this.quitarDeColaDeImpresion(part);
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
  async quitarDeColaDeImpresion(part : Parte){
    part.estado = 0;
    part.cantidadImpresa = 0;
    const key = part.idDb;
    delete part.idDb;
    await this.apiService.update(firebaseUrls.partesVendidas, key , part);
  }

}
