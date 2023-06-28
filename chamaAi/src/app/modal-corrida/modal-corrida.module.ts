import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCorridaPageRoutingModule } from './modal-corrida-routing.module';

import { ModalCorridaPage } from './modal-corrida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModalCorridaPageRoutingModule
  ],
  declarations: [ModalCorridaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalCorridaPageModule {}
