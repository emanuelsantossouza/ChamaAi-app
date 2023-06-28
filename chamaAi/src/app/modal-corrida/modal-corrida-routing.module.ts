import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCorridaPage } from './modal-corrida.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCorridaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCorridaPageRoutingModule {}
