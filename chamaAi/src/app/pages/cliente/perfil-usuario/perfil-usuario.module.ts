import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilUsuarioPageRoutingModule } from './perfil-usuario-routing.module';

import { PerfilUsuarioPage } from './perfil-usuario.page';
import { MenusPageModule } from 'src/app/components/menus/menus.module';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilUsuarioPageRoutingModule,
    MenusPageModule,
  ],
  declarations: [PerfilUsuarioPage],
})
export class PerfilUsuarioPageModule {}
