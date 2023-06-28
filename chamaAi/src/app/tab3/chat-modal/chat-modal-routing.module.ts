import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatModalPage } from './chat-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ChatModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatModalPageRoutingModule {}
