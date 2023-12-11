import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Ventas', url: '/venta', icon: 'assets/img/iconVenta.png' },
    { title: 'Modelos3D', url: '/modelo3d', icon: 'assets/img/iconModel3d.png' },
    { title: 'Cola de impresion', url: '/cola-impresion', icon: 'assets/img/iconCola.png' },
    { title: 'Clientes', url: '/clientes', icon: 'assets/img/iconClientes.png' },
    { title: 'Gastos extra', url: '/gastos-extra', icon: 'assets/img/iconGasto.png' },
    { title: 'Datos empresa', url: '/datos-empresa', icon: 'assets/img/iconDatosEmpresa.png' },
  
  ];
  
  constructor( ) {}
  ngOnInit() { 
  }
}
