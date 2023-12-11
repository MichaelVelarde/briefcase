import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscogerArticuloPage } from './escoger-articulo.page';

const routes: Routes = [
  {
    path: '',
    component: EscogerArticuloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscogerArticuloPageRoutingModule {}
