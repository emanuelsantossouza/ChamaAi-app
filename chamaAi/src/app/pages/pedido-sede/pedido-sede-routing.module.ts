import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoSedePage } from './pedido-sede.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoSedePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoSedePageRoutingModule {}
