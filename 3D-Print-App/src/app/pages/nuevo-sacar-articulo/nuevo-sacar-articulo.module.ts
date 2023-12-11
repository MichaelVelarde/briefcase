import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoSacarArticuloPageRoutingModule } from './nuevo-sacar-articulo-routing.module';

import { NuevoSacarArticuloPage } from './nuevo-sacar-articulo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoSacarArticuloPageRoutingModule
  ],
  declarations: [NuevoSacarArticuloPage]
})
export class NuevoSacarArticuloPageModule {}
