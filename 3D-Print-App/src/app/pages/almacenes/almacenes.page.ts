import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Almacen, firebaseUrls } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { LoginUserService } from 'src/app/services/login-user.service';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.page.html',
  styleUrls: ['./almacenes.page.scss'],
})
export class AlmacenesPage implements OnInit {
  public almacenes : Almacen[];
  public donwloadingDataB = true;
  public activeUserAdmin = false;

  constructor(private userService : LoginUserService,private alertController: AlertController,private router: Router,private apiService:  ApiService) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    if(!this.userService.getUsuario().admin){
      await this.redirigirNoAdmin();
    }
    else this.activeUserAdmin= true;
    await this.getAlmacenes();
  }
  async redirigirNoAdmin(){
    await this.alertController.create({
      subHeader: 'Seccion restringida!',
      buttons: [
        {
          text: 'continuar',
          handler: () => {
            this.router.navigate(['/ventas']);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
  navegarCreate(){
    this.router.navigate(['nuevo-almacen',{createAlmacen: this.almacenes.length}]);
  }

  async getAlmacenes(){
    const aux = this.apiService.getAll(firebaseUrls.almacenes).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        idDb: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.almacenes =data;
      aux.unsubscribe();
    }).add( () =>{
      this.donwloadingDataB = false;
    }); 
  }
  async borrarAlmacen(almacen : Almacen){
    await this.alertController.create({
        subHeader: 'Seguro que desea borrar el cliente: ' +almacen.nombre  ,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
                this.apiService.addLog('Borro el almacen: ' + almacen.nombre);
                this.apiService.remove(firebaseUrls.almacenes, almacen.idDb ).then((data) => {
                this.alertController.create({
                  subHeader: 'El almacen se elimino correctamente!'  ,
                  buttons: [
                    {
                      text: 'Continuar',
                      handler: () => {
                        this.getAlmacenes(); 
                      }
                    },
                  ]
                }).then(res => {
                  res.present();
                });
                
              });
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
