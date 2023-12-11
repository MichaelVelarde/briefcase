import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoSacarArticuloPage } from './nuevo-sacar-articulo.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoSacarArticuloPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoSacarArticuloPageRoutingModule {}
