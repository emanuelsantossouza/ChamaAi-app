import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { CadastroPageModule } from '../cadastros/cadastro.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    CadastroPageModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginPage],
  exports: [LoginPage]
})
export class LoginPageModule {}
