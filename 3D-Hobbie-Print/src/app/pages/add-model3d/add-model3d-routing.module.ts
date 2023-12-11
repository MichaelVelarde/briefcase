import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddModel3dPage } from './add-model3d.page';

const routes: Routes = [
  {
    path: '',
    component: AddModel3dPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddModel3dPageRoutingModule {}
