import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerArticuloSacadoPage } from './ver-articulo-sacado.page';

const routes: Routes = [
  {
    path: '',
    component: VerArticuloSacadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerArticuloSacadoPageRoutingModule {}
