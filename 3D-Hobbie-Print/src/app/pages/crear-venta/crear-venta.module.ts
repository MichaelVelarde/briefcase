import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearVentaPageRoutingModule } from './crear-venta-routing.module';

import { CrearVentaPage } from './crear-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearVentaPageRoutingModule
  ],
  declarations: [CrearVentaPage]
})
export class CrearVentaPageModule {}
