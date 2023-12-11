import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastosExtraPageRoutingModule } from './gastos-extra-routing.module';

import { GastosExtraPage } from './gastos-extra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastosExtraPageRoutingModule
  ],
  declarations: [GastosExtraPage]
})
export class GastosExtraPageModule {}
