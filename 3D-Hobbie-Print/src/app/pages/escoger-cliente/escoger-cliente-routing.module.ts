import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscogerClientePage } from './escoger-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: EscogerClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscogerClientePageRoutingModule {}
