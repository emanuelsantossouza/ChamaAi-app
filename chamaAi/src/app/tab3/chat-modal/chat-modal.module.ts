import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatModalPageRoutingModule } from './chat-modal-routing.module';

import { ChatModalPage } from './chat-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatModalPageRoutingModule
  ],
  declarations: [ChatModalPage]
})
export class ChatModalPageModule {}
