import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearModelo3dPageRoutingModule } from './crear-modelo3d-routing.module';

import { CrearModelo3dPage } from './crear-modelo3d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearModelo3dPageRoutingModule
  ],
  declarations: [CrearModelo3dPage]
})
export class CrearModelo3dPageModule {}
