import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Almacen, firebaseUrls } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-nuevo-almacen',
  templateUrl: './nuevo-almacen.page.html',
  styleUrls: ['./nuevo-almacen.page.scss'],
})
export class NuevoAlmacenPage implements OnInit {
  public almacen : Almacen;
  public nombre : string = "";
  public direccion : string = "";

  constructor(private router: Router,private alertController: AlertController,private apiService : ApiService) { }

  ngOnInit() {
  }
  async saveAlmacen(){
    if(this.nombre == "" || this.direccion == ""){
      alert("Debes llenar todos los datos.");
    }
    else{
      var ciudadSelected = (<HTMLInputElement>document.getElementById("valorCiudad")).value;
     
      this.almacen = {
        nombre: this.nombre, 
        direccion: this.direccion,
        ciudad : ciudadSelected,
      };
      this.apiService.addLog('Agrego el almacen: ' + this.almacen.nombre);
      await this.apiService.add(firebaseUrls.almacenes, this.almacen).then( ()=>{
        this.alertController.create({
          subHeader: 'El almacen se creo correctamente!'  ,
          buttons: [
            {
              text: 'Continuar',
              handler: () => {
                this.router.navigate(['almacenes',{nAlmacen: this.almacen.nombre}])
              }
            },
          ]
        }).then(res => {
          res.present();
        });
      })
      
    }
  }

}
