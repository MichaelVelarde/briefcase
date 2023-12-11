import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddModel3dPageRoutingModule } from './add-model3d-routing.module';

import { AddModel3dPage } from './add-model3d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddModel3dPageRoutingModule
  ],
  declarations: [AddModel3dPage]
})
export class AddModel3dPageModule {}
