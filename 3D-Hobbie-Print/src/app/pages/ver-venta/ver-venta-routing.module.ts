import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerVentaPage } from './ver-venta.page';

const routes: Routes = [
  {
    path: '',
    component: VerVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerVentaPageRoutingModule {}
