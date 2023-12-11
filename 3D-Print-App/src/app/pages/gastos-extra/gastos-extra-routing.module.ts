import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GastosExtraPage } from './gastos-extra.page';

const routes: Routes = [
  {
    path: '',
    component: GastosExtraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GastosExtraPageRoutingModule {}
