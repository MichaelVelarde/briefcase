import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearVentaPage } from './crear-venta.page';

const routes: Routes = [
  {
    path: '',
    component: CrearVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearVentaPageRoutingModule {}
