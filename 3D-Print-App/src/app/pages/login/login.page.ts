import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { firebaseUrls, User } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { LoginUserService } from 'src/app/services/login-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user:string;
  password:string;
  public users : User[];

  constructor(private router: Router , private apiService:  ApiService , private userService : LoginUserService) { }

  async ngOnInit() {
    await this.getUser()
  }
  async getUser(){
    const aux = this.apiService.getAll(firebaseUrls.usuarios).snapshotChanges().pipe(
      map(cambiar=> cambiar.map(c => ({
        id: c.payload.key , ... c.payload.val()
      })))
    ).subscribe(data =>{
      this.users =data;
      aux.unsubscribe();
    })
  }

  async login(){
    let usuarioValido = false;
    for (let i = 0; i < this.users.length; i++) 
      if(this.user == this.users[i].user && this.password == this.users[i].password){
        usuarioValido = true;
        await this.userService.cambiarUsuario(this.users[i]);
        this.router.navigate(["/ventas"]);
      }
    if(!usuarioValido)
      alert("Usuario no encontrado!");
  }

}
