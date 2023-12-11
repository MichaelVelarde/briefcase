import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearModelo3dPage } from './crear-modelo3d.page';

const routes: Routes = [
  {
    path: '',
    component: CrearModelo3dPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearModelo3dPageRoutingModule {}
