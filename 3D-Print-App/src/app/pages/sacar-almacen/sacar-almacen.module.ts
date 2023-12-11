import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SacarAlmacenPageRoutingModule } from './sacar-almacen-routing.module';

import { SacarAlmacenPage } from './sacar-almacen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SacarAlmacenPageRoutingModule
  ],
  declarations: [SacarAlmacenPage],
})
export class SacarAlmacenPageModule {}
