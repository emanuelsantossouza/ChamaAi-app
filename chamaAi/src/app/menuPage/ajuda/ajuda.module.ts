import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjudaPageRoutingModule } from './ajuda-routing.module';

import { AjudaPage } from './ajuda.page';
import { MenusPage } from 'src/app/components/menus/menus.page';
import { MenusPageModule } from 'src/app/components/menus/menus.module';
import { NavbarPageModule } from 'src/app/components/navbar/navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjudaPageRoutingModule,
    MenusPageModule,
    NavbarPageModule
  ],
  declarations: [AjudaPage]
})
export class AjudaPageModule {}
