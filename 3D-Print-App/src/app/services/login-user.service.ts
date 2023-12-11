import { Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {

  @Output() saveUser? : User

  constructor(private alertController: AlertController, private router: Router) { }

  cambiarUsuario(user: User) : Promise<string>{
    return new Promise(resolve =>{
      this.saveUser = user;
      resolve('done');
      return;
    }); 
    
  }
  getUsuario(){
    if( this.saveUser == undefined){
      this.alertController.create({
        subHeader: 'Necesitas iniciar sesion para acceder a la aplicacion!: '   ,
        buttons: [
          {
            text: 'Continuar',
            handler: () => {  
              this.router.navigate(["/login"]);
            }
          },
        ]
      }).then(res => {
        res.present();
      });
      return { id: 'null',password: 'null',user: 'null',admin : false};
    }
    return this.saveUser;
  }
  eliminarUsuario(){
    this.saveUser = undefined;
  }

}
