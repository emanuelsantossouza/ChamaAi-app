import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SobreNosPageRoutingModule } from './sobre-nos-routing.module';

import { SobreNosPage } from './sobre-nos.page';
import { MenusPageModule } from 'src/app/components/menus/menus.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobreNosPageRoutingModule,
    MenusPageModule
  ],
  declarations: [SobreNosPage]
})
export class SobreNosPageModule {}
