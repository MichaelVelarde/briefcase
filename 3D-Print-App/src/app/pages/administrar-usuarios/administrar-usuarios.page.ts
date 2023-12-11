import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { User,firebaseUrls, CuentaEmpresa } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { LoginUserService } from 'src/app/services/login-user.service';

@Component({
  selector: 'app-administrar-usuarios',
  templateUrl: './administrar-usuarios.page.html',
  styleUrls: ['./administrar-usuarios.page.scss'],
})
export class AdministrarUsuariosPage implements OnInit {
  user:string;
  password:string;
  admin:boolean;
  public users : User [];
  public cuentaEmpresa : CuentaEmpresa;
  public cuentaEmpresaArray : CuentaEmpresa[];
  public activeUserAdmin = false;
  public donwloadingDataB = true;
  constructor(private userService : LoginUserService, private router: Router,private apiService : ApiService, public alertController: AlertController) { }

  async ngOnInit() {
    this.donwloadingDataB = true;
    if(!this.userService.getUsuario().admin){
      await this.redirigirNoAdmin();
    }
    else this.activeUserAdmin= true;
      
    this.admin = false;
    await this.getUsers();
    await this.getCuentaEmpresa();
  }
  async getCuentaEmpresa(){
    const aux = this.apiService.getAll(firebaseUrls.cuentaEmpresa).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key , ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.cuentaEmpresaArray =data;
      aux.unsubscribe();
    }).add( () =>{
      if(this.cuentaEmpresaArray[0] != undefined){
        this.cuentaEmpresa = this.cuentaEmpresaArray[0];
      }
    });
  }
  navegarLog(){
    this.router.navigate(['ver-log']);
  }

  crearUsuario(){
    if(this.user.length > 4 && this.password.length > 4){
      this.apiService.addLog('Agrego el usuario: ' + this.user);
      this.apiService.add(firebaseUrls.usuarios,{ admin: this.admin, user: this.user , password: this.password } ).then( ()=>{
        alert("Se creo el usuario correctamente!");
        this.getUsers();
      })  
    }
    else
      alert("Usuario o contraseña muy corta!");
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

  deleteUser(user : User){
    this.alertController.create({
      subHeader: 'Seguro que desea borrar el usuario: ' + user.user ,
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.apiService.addLog('Borro el usuario: ' + user.user);
            this.apiService.remove(firebaseUrls.usuarios, user.id);
            this.getUsers();
          }
        },
        {
          text: 'No',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async getUsers(){
    const aux = this.apiService.getAll(firebaseUrls.usuarios).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key, ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.users =data;
      aux.unsubscribe();
    }).add( ()=>{
      this.donwloadingDataB = false;
    }) 
  }
  async agregarFondosCuenta(){
    this.alertController.create({
      subHeader: 'Cantidad que desea agregar a los fondos de la empresa ' ,
      inputs:[{
            name:'number',
            placeholder: '0',
            type: 'number',
            min: '0',
        }],
      buttons: [
        {
          text: 'Continuar',
          handler: async data =>{
            await this.actualizarCuentaEmpresa(parseInt(data.number));
            
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
  async sacarFondosCuenta(){
    this.alertController.create({
      subHeader: 'Cantidad que desea sacar de los fondos de la empresa ' ,
      inputs:[{
            name:'number',
            placeholder: '0',
            type: 'number',
            min: '0',
        }],
      buttons: [
        {
          text: 'Continuar',
          handler: async data =>{
            let aux = parseInt(data.number) *-1;
            await this.actualizarCuentaEmpresa(aux)
           
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

  async actualizarCuentaEmpresa(cantidadFondo : number){
    this.apiService.addLog('Modifico los fondos de la cuenta de la empresa en: ' + cantidadFondo);
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
      cuentaEmpresa.fondos = cuentaEmpresa.fondos +cantidadFondo;
      this.cuentaEmpresa.fondos = cuentaEmpresa.fondos;
      await this.apiService.update(firebaseUrls.cuentaEmpresa,'-NBQPOCaRtWpyQMpJuuP' , {
      fondos : cuentaEmpresa.fondos,
      });
    })
    
  }

}
