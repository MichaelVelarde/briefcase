import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearProformaPageRoutingModule } from './crear-proforma-routing.module';

import { CrearProformaPage } from './crear-proforma.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearProformaPageRoutingModule
  ],
  declarations: [CrearProformaPage]
})
export class CrearProformaPageModule {}
