import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlterarUsuarioPageRoutingModule } from './alterar-usuario-routing.module';

import { AlterarUsuarioPage } from './alterar-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlterarUsuarioPageRoutingModule
  ],
  declarations: [AlterarUsuarioPage]
})
export class AlterarUsuarioPageModule {}
