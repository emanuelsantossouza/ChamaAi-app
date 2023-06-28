import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoSedePageRoutingModule } from './pedido-sede-routing.module';

import { PedidoSedePage } from './pedido-sede.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoSedePageRoutingModule
  ],
  declarations: [PedidoSedePage]
})
export class PedidoSedePageModule {}
