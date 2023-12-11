import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoginUserService } from './services/login-user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Ventas', url: '/ventas', icon: 'assets/img/iconVenta.png' },
    { title: 'Inventario', url: '/inventario', icon: 'assets/img/iconInventario.png' },
    { title: 'Ver Clientes', url: '/clientes', icon: 'assets/img/iconClientes.png' },
    { title: 'Gastos Extra', url: '/gastos-extra', icon: 'assets/img/iconGastos.png' },
    { title: 'Sacar de almacen', url: '/sacar-almacen', icon: 'assets/img/iconSacarAlmacen.png' },
    { title: 'Almacenes', url: '/almacenes', icon: 'assets/img/iconAlmacen.png' },
    { title: 'Administrar', url: '/administrar-usuarios', icon: 'assets/img/iconAdmin.png' },
    { title: 'Cerrar sesion', url: '/login', icon: 'assets/img/logOut.png' },
  ];
  
  constructor( private userService : LoginUserService) {}
  ngOnInit() { 
    this.userService.getUsuario();
  }
}
