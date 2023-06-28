import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { ExploreContainerComponentModule } from 'src/app/explore-container/explore-container.module';
import { CadastroPageModule } from '../cadastros/cadastro.module';
import { LoginFacebookComponenetModule } from 'src/app/login-facebook/login-facebook.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    CadastroPageModule,
    ExploreContainerComponentModule,
    LoginFacebookComponenetModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginPage],
  exports: [LoginPage]
})
export class LoginPageModule {}
