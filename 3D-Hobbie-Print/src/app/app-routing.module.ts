import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'venta',
    pathMatch: 'full'
  },
  {
    path: 'clientes',
    loadChildren: () => import('./pages/clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: 'cola-impresion',
    loadChildren: () => import('./pages/cola-impresion/cola-impresion.module').then( m => m.ColaImpresionPageModule)
  },
  {
    path: 'partes',
    loadChildren: () => import('./pages/partes/partes.module').then( m => m.PartesPageModule)
  },
  {
    path: 'crear-parte',
    loadChildren: () => import('./pages/crear-parte/crear-parte.module').then( m => m.CrearPartePageModule)
  },
  {
    path: 'ver-parte',
    loadChildren: () => import('./pages/ver-parte/ver-parte.module').then( m => m.VerPartePageModule)
  },
  {
    path: 'ver-cliente',
    loadChildren: () => import('./pages/ver-cliente/ver-cliente.module').then( m => m.VerClientePageModule)
  },
  {
    path: 'crear-cliente',
    loadChildren: () => import('./pages/crear-cliente/crear-cliente.module').then( m => m.CrearClientePageModule)
  },
  {
    path: 'escoger-cliente',
    loadChildren: () => import('./pages/escoger-cliente/escoger-cliente.module').then( m => m.EscogerClientePageModule)
  },
  {
    path: 'datos-empresa',
    loadChildren: () => import('./pages/datos-empresa/datos-empresa.module').then( m => m.DatosEmpresaPageModule)
  },
  {
    path: 'gastos-extra',
    loadChildren: () => import('./pages/gastos-extra/gastos-extra.module').then( m => m.GastosExtraPageModule)
  },
  {
    path: 'crear-gasto',
    loadChildren: () => import('./pages/crear-gasto/crear-gasto.module').then( m => m.CrearGastoPageModule)
  },
  {
    path: 'modelo3d',
    loadChildren: () => import('./pages/modelo3-d/modelo3-d.module').then( m => m.Modelo3DPageModule)
  },
  {
    path: 'venta',
    loadChildren: () => import('./pages/venta/venta.module').then( m => m.VentaPageModule)
  },
  {
    path: 'crear-modelo3d',
    loadChildren: () => import('./pages/crear-modelo3d/crear-modelo3d.module').then( m => m.CrearModelo3dPageModule)
  },
  {
    path: 'crear-venta',
    loadChildren: () => import('./pages/crear-venta/crear-venta.module').then( m => m.CrearVentaPageModule)
  },
  {
    path: 'ver-venta',
    loadChildren: () => import('./pages/ver-venta/ver-venta.module').then( m => m.VerVentaPageModule)
  },
  {
    path: 'add-model3d',
    loadChildren: () => import('./pages/add-model3d/add-model3d.module').then( m => m.AddModel3dPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
