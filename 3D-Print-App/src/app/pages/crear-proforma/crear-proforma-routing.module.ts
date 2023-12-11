import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearProformaPage } from './crear-proforma.page';

const routes: Routes = [
  {
    path: '',
    component: CrearProformaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearProformaPageRoutingModule {}
