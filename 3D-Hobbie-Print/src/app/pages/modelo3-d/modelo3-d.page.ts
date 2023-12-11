import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Cotizacion, firebaseUrls, Mes, Modelo3d, Parte } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api-firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modelo3-d',
  templateUrl: './modelo3-d.page.html',
  styleUrls: ['./modelo3-d.page.scss'],
})
export class Modelo3DPage implements OnInit {

  public donwloadingDataB = true;
  public nextId =1;
  public modelos3D : Modelo3d[];
  public cotizaciones: Cotizacion[];
  public meses: Mes[];

  constructor( private storage: Storage, public alertController: AlertController, private router: Router ,  private apiService:  ApiService ) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getModelos3D();
  }
  async getModelos3D(){
    this.apiService.getAll(firebaseUrls.modelo3d).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(async data =>{
      this.modelos3D =data;
      if(this.modelos3D != undefined && this.modelos3D.length >0 ){
        this.modelos3D.reverse();
        this.nextId = this.modelos3D[0].id +1;
      }
      this.donwloadingDataB = false;
    })
  }
  async navegarCreate(){
    await this.storage.create();
    await this.storage.set('modelo3D', {id :this.nextId});
    this.router.navigate(['crear-modelo3d',{createModeo3d: this.nextId}]);
  }

  async verPartes(modelo : Modelo3d){
    await this.storage.create();
    await this.storage.set('keymodelo3D', modelo.idDb);
    this.router.navigate(['partes',{verPartes: modelo.id}]);
  }
  getNumPartesModel(modelo : Modelo3d){
    if(modelo.keysParte[0] == 'Empty')
      return 0;
    else return modelo.keysParte.length;

  }
  deleteModelo3d(modelo : Modelo3d){
    this.alertController.create({
      subHeader: 'Esta seguro que desea borrar la cotizacion y todas sus partes?'  ,
      buttons: [
        {
          text: 'Aceptar',
            handler: async () => {
              this.donwloadingDataB = true;
              await  this.borrarTodoDeModelo3d(modelo);
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
  
  async borrarTodoDeModelo3d(modelo : Modelo3d){
    if(modelo.keysParte[0] != 'Empty')
      modelo.keysParte.forEach(async key =>{
        await this.apiService.remove(firebaseUrls.partes , key);
      })
    await this.apiService.remove(firebaseUrls.modelo3d , modelo.idDb);
    this.donwloadingDataB = false;
  }

}
