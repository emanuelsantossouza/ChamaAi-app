import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscolhaServicoModalPageRoutingModule } from './escolha-servico-modal-routing.module';

import { EscolhaServicoModalPage } from './escolha-servico-modal.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscolhaServicoModalPageRoutingModule
  ],
  declarations: [EscolhaServicoModalPage]
})
export class EscolhaServicoModalPageModule {}
