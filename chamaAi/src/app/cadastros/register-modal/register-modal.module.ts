import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterModalPageRoutingModule } from './register-modal-routing.module';

import { RegisterModalPage } from './register-modal.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterModalPageRoutingModule,
  ],
  declarations: [
    RegisterModalPage,

  ],
  providers: [
    provideNgxMask()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RegisterModalPageModule { }
