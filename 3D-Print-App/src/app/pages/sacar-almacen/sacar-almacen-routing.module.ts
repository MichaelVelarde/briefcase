import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SacarAlmacenPage } from './sacar-almacen.page';

const routes: Routes = [
  {
    path: '',
    component: SacarAlmacenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SacarAlmacenPageRoutingModule {}
