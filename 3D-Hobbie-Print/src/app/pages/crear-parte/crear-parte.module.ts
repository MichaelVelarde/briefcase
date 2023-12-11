import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearPartePageRoutingModule } from './crear-parte-routing.module';

import { CrearPartePage } from './crear-parte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearPartePageRoutingModule
  ],
  declarations: [CrearPartePage]
})
export class CrearPartePageModule {}
