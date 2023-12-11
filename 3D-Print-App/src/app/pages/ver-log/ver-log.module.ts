import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerLogPageRoutingModule } from './ver-log-routing.module';

import { VerLogPage } from './ver-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerLogPageRoutingModule
  ],
  declarations: [VerLogPage]
})
export class VerLogPageModule {}
