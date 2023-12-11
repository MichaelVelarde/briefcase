import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscogerClientePageRoutingModule } from './escoger-cliente-routing.module';

import { EscogerClientePage } from './escoger-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscogerClientePageRoutingModule
  ],
  declarations: [EscogerClientePage]
})
export class EscogerClientePageModule {}
