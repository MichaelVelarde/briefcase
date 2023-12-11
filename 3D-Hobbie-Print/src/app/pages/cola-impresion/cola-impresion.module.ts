import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColaImpresionPageRoutingModule } from './cola-impresion-routing.module';

import { ColaImpresionPage } from './cola-impresion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColaImpresionPageRoutingModule
  ],
  declarations: [ColaImpresionPage]
})
export class ColaImpresionPageModule {}
