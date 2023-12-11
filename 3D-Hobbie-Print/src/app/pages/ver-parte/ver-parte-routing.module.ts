import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPartePage } from './ver-parte.page';

const routes: Routes = [
  {
    path: '',
    component: VerPartePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPartePageRoutingModule {}
