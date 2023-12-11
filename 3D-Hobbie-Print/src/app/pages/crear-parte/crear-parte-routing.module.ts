import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearPartePage } from './crear-parte.page';

const routes: Routes = [
  {
    path: '',
    component: CrearPartePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearPartePageRoutingModule {}
