import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Modelo3DPage } from './modelo3-d.page';

const routes: Routes = [
  {
    path: '',
    component: Modelo3DPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Modelo3DPageRoutingModule {}
