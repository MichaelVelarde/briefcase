import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoGastoExtraPage } from './nuevo-gasto-extra.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoGastoExtraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoGastoExtraPageRoutingModule {}
