import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoAlmacenPage } from './nuevo-almacen.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoAlmacenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoAlmacenPageRoutingModule {}
