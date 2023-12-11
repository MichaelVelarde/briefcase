import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscogerArticuloSacarPageRoutingModule } from './escoger-articulo-sacar-routing.module';

import { EscogerArticuloSacarPage } from './escoger-articulo-sacar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscogerArticuloSacarPageRoutingModule
  ],
  declarations: [EscogerArticuloSacarPage]
})
export class EscogerArticuloSacarPageModule {}
