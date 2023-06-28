import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenusPageRoutingModule } from './menus-routing.module';
import { MenusPage } from './menus.page';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenusPageRoutingModule
  ],
  exports: [MenusPage],
  declarations: [MenusPage]
})
export class MenusPageModule {}
