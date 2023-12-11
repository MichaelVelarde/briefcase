import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlmacenesPageRoutingModule } from './almacenes-routing.module';

import { AlmacenesPage } from './almacenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlmacenesPageRoutingModule
  ],
  declarations: [AlmacenesPage],
 
})
export class AlmacenesPageModule {}
