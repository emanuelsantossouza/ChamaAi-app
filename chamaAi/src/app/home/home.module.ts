import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { LoginPage } from '../cadastros/login/login.page';
import { LoginPageModule } from '../cadastros/login/login.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TabsPage } from '../tabs/tabs.page';
import { TabsPageModule } from '../tabs/tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TabsPageModule
  ],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
