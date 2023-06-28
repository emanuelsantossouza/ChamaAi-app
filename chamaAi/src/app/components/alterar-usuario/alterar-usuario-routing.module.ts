import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlterarUsuarioPage } from './alterar-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: AlterarUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlterarUsuarioPageRoutingModule {}
