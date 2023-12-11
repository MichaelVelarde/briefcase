import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoAlmacenPageRoutingModule } from './nuevo-almacen-routing.module';

import { NuevoAlmacenPage } from './nuevo-almacen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoAlmacenPageRoutingModule
  ],
  declarations: [NuevoAlmacenPage]
})
export class NuevoAlmacenPageModule {}
