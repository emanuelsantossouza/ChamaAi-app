import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})
export class MenusPage implements OnInit {
  corDoTemaAtual!: boolean

  constructor(private cookieService: CookieService) {
    this.corDoTemaAtual = Boolean(this.cookieService.get('NovoCorTema'))

    if (this.corDoTemaAtual) {
      document.body.setAttribute('color-theme', 'dark')
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }

  ngOnInit() {
  }

  public appPages = [
    { title: 'Home', url: '/tabs', icon: 'home'},
    { title: 'Perfil usuario', url: '/perfil-usuario', icon: 'person'},
    { title: 'Historicos de corridas', url: '/historico', icon: 'time' },
    { title: 'Configurações', url: '/configuracoes', icon: 'cog' },
    { title: 'Favoritos', url: '/favoritos', icon: 'heart' },
    { title: 'Ajuda', url: '/ajuda', icon: 'information' },
    { title: 'Sobre nós', url: '/sobre-nos', icon: 'people' },
    { title: 'Fale Conosco', url: '/fale-conosco', icon: 'chatbubbles' },
  ];




  trocaDeTema(event: any) {
    this.cookieService.delete('NovoCorTema');
    this.corDoTemaAtual = event.detail.checked;

    this.cookieService.set('NovoCorTema', this.corDoTemaAtual.toString())


    if (this.corDoTemaAtual) {
      document.body.setAttribute('color-theme', 'dark')
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }
}
