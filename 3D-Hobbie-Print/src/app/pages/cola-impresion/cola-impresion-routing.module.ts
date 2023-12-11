import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColaImpresionPage } from './cola-impresion.page';

const routes: Routes = [
  {
    path: '',
    component: ColaImpresionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColaImpresionPageRoutingModule {}
