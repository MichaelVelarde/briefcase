import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('./pages/ventas/ventas.module').then( m => m.VentasPageModule)
  },
  {
    path: 'inventario',
    loadChildren: () => import('./pages/inventario/inventario.module').then( m => m.InventarioPageModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'almacenes',
    loadChildren: () => import('./pages/almacenes/almacenes.module').then( m => m.AlmacenesPageModule)
  },
  {
    path: 'gastos-extra',
    loadChildren: () => import('./pages/gastos-extra/gastos-extra.module').then( m => m.GastosExtraPageModule)
  },
  {
    path: 'sacar-almacen',
    loadChildren: () => import('./pages/sacar-almacen/sacar-almacen.module').then( m => m.SacarAlmacenPageModule)
  },
  {
    path: 'administrar-usuarios',
    loadChildren: () => import('./pages/administrar-usuarios/administrar-usuarios.module').then( m => m.AdministrarUsuariosPageModule)
  },
  {
    path: 'nueva-venta',
    loadChildren: () => import('./pages/nueva-venta/nueva-venta.module').then( m => m.NuevaVentaPageModule)
  },
  {
    path: 'escoger-cliente',
    loadChildren: () => import('./pages/escoger-cliente/escoger-cliente.module').then( m => m.EscogerClientePageModule)
  },
  {
    path: 'escoger-articulo',
    loadChildren: () => import('./pages/escoger-articulo/escoger-articulo.module').then( m => m.EscogerArticuloPageModule)
  },
  {
    path: 'ver-venta',
    loadChildren: () => import('./pages/ver-venta/ver-venta.module').then( m => m.VerVentaPageModule)
  },
  {
    path: 'ver-articulo',
    loadChildren: () => import('./pages/ver-articulo/ver-articulo.module').then( m => m.VerArticuloPageModule)
  },
  {
    path: 'nuevo-articulo',
    loadChildren: () => import('./pages/nuevo-articulo/nuevo-articulo.module').then( m => m.NuevoArticuloPageModule)
  },
  {
    path: 'nuevo-cliente',
    loadChildren: () => import('./pages/nuevo-cliente/nuevo-cliente.module').then( m => m.NuevoClientePageModule)
  },
  {
    path: 'nuevo-almacen',
    loadChildren: () => import('./pages/nuevo-almacen/nuevo-almacen.module').then( m => m.NuevoAlmacenPageModule)
  },
  {
    path: 'nuevo-gasto-extra',
    loadChildren: () => import('./pages/nuevo-gasto-extra/nuevo-gasto-extra.module').then( m => m.NuevoGastoExtraPageModule)
  },
  {
    path: 'nuevo-sacar-articulo',
    loadChildren: () => import('./pages/nuevo-sacar-articulo/nuevo-sacar-articulo.module').then( m => m.NuevoSacarArticuloPageModule)
  },
  {
    path: 'ver-articulo-sacado',
    loadChildren: () => import('./pages/ver-articulo-sacado/ver-articulo-sacado.module').then( m => m.VerArticuloSacadoPageModule)
  },
  {
    path: 'escoger-articulo-sacar',
    loadChildren: () => import('./pages/escoger-articulo-sacar/escoger-articulo-sacar.module').then( m => m.EscogerArticuloSacarPageModule)
  },
  {
    path: 'ver-log',
    loadChildren: () => import('./pages/ver-log/ver-log.module').then( m => m.VerLogPageModule)
  },  {
    path: 'crear-proforma',
    loadChildren: () => import('./pages/crear-proforma/crear-proforma.module').then( m => m.CrearProformaPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
