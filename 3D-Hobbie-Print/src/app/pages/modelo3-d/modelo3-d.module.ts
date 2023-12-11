import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Modelo3DPageRoutingModule } from './modelo3-d-routing.module';

import { Modelo3DPage } from './modelo3-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Modelo3DPageRoutingModule
  ],
  declarations: [Modelo3DPage]
})
export class Modelo3DPageModule {}
