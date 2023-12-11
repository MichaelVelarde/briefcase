import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerArticuloPageRoutingModule } from './ver-articulo-routing.module';

import { VerArticuloPage } from './ver-articulo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerArticuloPageRoutingModule
  ],
  declarations: [VerArticuloPage]
})
export class VerArticuloPageModule {}
