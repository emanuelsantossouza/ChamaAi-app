import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'menus',
    loadChildren: () => import('./components/menus/menus.module').then(m => m.MenusPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./cadastros/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastros/cadastros/cadastro.module').then(m => m.CadastroPageModule)
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule)
  },
  {
    path: 'navbar',
    loadChildren: () => import('./components/navbar/navbar.module').then(m => m.NavbarPageModule)
  },
  {
    path: 'historico',
    loadChildren: () => import('./menuPage/historico/historico.module').then(m => m.HistoricoPageModule)
  },
  {
    path: 'configuracoes',
    loadChildren: () => import('./menuPage/configuracoes/configuracoes.module').then(m => m.ConfiguracoesPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./menuPage/favoritos/favoritos.module').then(m => m.FavoritosPageModule)
  },
  {
    path: 'ajuda',
    loadChildren: () => import('./menuPage/ajuda/ajuda.module').then(m => m.AjudaPageModule)
  },
  {
    path: 'sobre-nos',
    loadChildren: () => import('./menuPage/sobre-nos/sobre-nos.module').then(m => m.SobreNosPageModule)
  },
  {
    path: 'fale-conosco',
    loadChildren: () => import('./menuPage/fale-conosco/fale-conosco.module').then(m => m.FaleConoscoPageModule)
  },
  {
    path: 'pedido',
    loadChildren: () => import('./components/pedido/pedido.module').then(m => m.PedidoPageModule)
  },
  {
    path: 'alterar-usuario',
    loadChildren: () => import('./components/alterar-usuario/alterar-usuario.module').then(m => m.AlterarUsuarioPageModule)
  },
  {
    path: 'pedido-sede',
    loadChildren: () => import('./pages/pedido-sede/pedido-sede.module').then(m => m.PedidoSedePageModule)
  },
  {
    path: 'login-modal',
    loadChildren: () => import('./cadastros/login-modal/login-modal.module').then(m => m.LoginModalPageModule)
  },
  {
    path: 'register-modal',
    loadChildren: () => import('./cadastros/register-modal/register-modal.module').then(m => m.RegisterModalPageModule)
  },
  {
    path: 'perfil-usuario',
    loadChildren: () => import('./pages/cliente/perfil-usuario/perfil-usuario.module').then( m => m.PerfilUsuarioPageModule)
  },
  {
    path: 'pesquisa',
    loadChildren: () => import('./modals/pesquisa/pesquisa.module').then( m => m.PesquisaPageModule)
  },
  {
    path: 'escolha-usuario',
    loadChildren: () => import('./tab1/escolha-servico-modal/escolha-servico-modal.module').then(m => m.EscolhaServicoModalPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'modal-corrida',
    loadChildren: () => import('./modal-corrida/modal-corrida.module').then( m => m.ModalCorridaPageModule)
  },
  {
    path: 'modal-entrega',
    loadChildren: () => import('./modal-entrega/modal-entrega.module').then( m => m.ModalEntregaPageModule)
  },
  {
    path: 'chat-modal',
    loadChildren: () => import('./tab3/chat-modal/chat-modal.module').then(m => m.ChatModalPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

