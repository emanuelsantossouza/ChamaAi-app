import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfiguracoesPageRoutingModule } from './configuracoes-routing.module';

import { ConfiguracoesPage } from './configuracoes.page';
import { MenusPageModule } from 'src/app/components/menus/menus.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracoesPageRoutingModule,
    MenusPageModule
  ],
  declarations: [ConfiguracoesPage]
})
export class ConfiguracoesPageModule {}
