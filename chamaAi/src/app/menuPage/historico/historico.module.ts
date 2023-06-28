import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricoPageRoutingModule } from './historico-routing.module';

import { HistoricoPage } from './historico.page';
import { MenusPageModule } from 'src/app/components/menus/menus.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricoPageRoutingModule,
    MenusPageModule
  ],
  declarations: [HistoricoPage]
})
export class HistoricoPageModule {}
