import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerVentaPageRoutingModule } from './ver-venta-routing.module';

import { VerVentaPage } from './ver-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerVentaPageRoutingModule
  ],
  declarations: [VerVentaPage]
})
export class VerVentaPageModule {}
