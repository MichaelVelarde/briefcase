import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoGastoExtraPageRoutingModule } from './nuevo-gasto-extra-routing.module';

import { NuevoGastoExtraPage } from './nuevo-gasto-extra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoGastoExtraPageRoutingModule
  ],
  declarations: [NuevoGastoExtraPage]
})
export class NuevoGastoExtraPageModule {}
