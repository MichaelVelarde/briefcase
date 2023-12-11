import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Constantes, firebaseUrls, Modelo3d } from 'src/app/models';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api-firebase.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-crear-modelo3d',
  templateUrl: './crear-modelo3d.page.html',
  styleUrls: ['./crear-modelo3d.page.scss'],
})
export class CrearModelo3dPage implements OnInit {

  public donwloadingDataB = true;
  public modelo3d : Modelo3d;
  public nombre : string = "";
  
  constructor(private apiService:  ApiService,public alertController: AlertController, private router: Router,private storage: Storage) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    await this.getDataStorage();
  }


  async getDataStorage(){
    await this.storage.get('modelo3D').then((modelo3d) => {
      this.modelo3d = modelo3d;
    });
    this.donwloadingDataB = false;
  }

  async agregarModelo3D(){
    if(this.nombre == "")
      this.alertController.create({
        subHeader: 'Debe llenar el campo => nombre'  ,
        buttons: [
          {
            text: 'cerrar',
          },
        ]
      }).then(res => {
        res.present();
      });
    else{
    this.modelo3d.precio = 0;
    this.modelo3d.costo = 0;
    this.modelo3d.nombre = this.nombre;
    this.modelo3d.keysParte = ['Empty'];
    await this.apiService.add(firebaseUrls.modelo3d, this.modelo3d ).then((data) => {
      this.alertController.create({
        subHeader: 'La Modelo se creo correctamente!'  ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {
              this.modelo3d.id = this.modelo3d.id +1;
              this.router.navigate(['modelo3d',{nModelo: this.modelo3d.id}])
            }
          },
        ]
      }).then(res => {
        res.present();
      });
      
    });
    }

  }

}
