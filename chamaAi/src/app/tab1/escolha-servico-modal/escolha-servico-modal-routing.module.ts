import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscolhaServicoModalPage } from './escolha-servico-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EscolhaServicoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscolhaServicoModalPageRoutingModule {}
