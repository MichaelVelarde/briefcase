import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscogerArticuloPageRoutingModule } from './escoger-articulo-routing.module';

import { EscogerArticuloPage } from './escoger-articulo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscogerArticuloPageRoutingModule
  ],
  declarations: [EscogerArticuloPage]
})
export class EscogerArticuloPageModule {}
