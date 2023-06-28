import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab3Page } from './tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab3Page
  },  {
    path: 'chat-modal',
    loadChildren: () => import('./chat-modal/chat-modal.module').then( m => m.ChatModalPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab3PageRoutingModule {}
