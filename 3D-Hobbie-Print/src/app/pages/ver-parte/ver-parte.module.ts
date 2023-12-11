import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPartePageRoutingModule } from './ver-parte-routing.module';

import { VerPartePage } from './ver-parte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPartePageRoutingModule
  ],
  declarations: [VerPartePage]
})
export class VerPartePageModule {}
