import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEntregaPage } from './modal-entrega.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEntregaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEntregaPageRoutingModule {}
