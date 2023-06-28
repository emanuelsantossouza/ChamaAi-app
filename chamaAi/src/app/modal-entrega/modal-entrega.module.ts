import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEntregaPageRoutingModule } from './modal-entrega-routing.module';

import { ModalEntregaPage } from './modal-entrega.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalEntregaPageRoutingModule
  ],
  declarations: [ModalEntregaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalEntregaPageModule {}
