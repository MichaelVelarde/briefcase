import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerLogPage } from './ver-log.page';

const routes: Routes = [
  {
    path: '',
    component: VerLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerLogPageRoutingModule {}
