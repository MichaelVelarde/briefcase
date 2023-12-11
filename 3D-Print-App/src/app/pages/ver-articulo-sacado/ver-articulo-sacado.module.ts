import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerArticuloSacadoPageRoutingModule } from './ver-articulo-sacado-routing.module';

import { VerArticuloSacadoPage } from './ver-articulo-sacado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerArticuloSacadoPageRoutingModule
  ],
  declarations: [VerArticuloSacadoPage]
})
export class VerArticuloSacadoPageModule {}
