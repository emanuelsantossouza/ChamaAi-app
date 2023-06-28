import { MotoboyService } from './../services/motoboy.service';
import { SedeService } from './../services/sede.service';
import { Sede } from '../models/Sede';
import { Motoboy } from '../models/motoboy';
import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CookieService } from 'ngx-cookie-service';
import { AnimationController, ModalController } from '@ionic/angular';
import { EscolhaServicoModalPage } from './escolha-servico-modal/escolha-servico-modal.page';
import { NavbarPage } from '../components/navbar/navbar.page';
register();

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  listaDadosHtmlMotoboy: Motoboy[] = [];
  listaDadosHtmlSede: Sede[] = [];

  corDoTemaAtual!: boolean

  constructor(
    private SedeServidor: SedeService,
    private motoboyService: MotoboyService,
    private cookieService: CookieService,
    public modalCtrl: ModalController,
    private animationCtrl: AnimationController) {
    this.buscarDadosSedes(),
    this.buscarDadosMotoboys()

    this.corDoTemaAtual = Boolean(this.cookieService.get('NovoCorTema'))

    if (this.corDoTemaAtual == true) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }

  buscarDadosSedes() {
    this.SedeServidor.BuscarDadosSede().subscribe((dados) => {
      this.listaDadosHtmlSede = dados;
      this.listaDadosHtmlSede.reverse();
    })
  }

  buscarDadosMotoboys() {
    this.motoboyService.BuscarDadosMotoboy().subscribe((dados) => {
      console.log(dados)
      this.listaDadosHtmlMotoboy = dados;
      this.listaDadosHtmlMotoboy.reverse()
      console.log(this.listaDadosHtmlMotoboy)
    })
  }

  salvarSedeId(sedeId: number) {
    console.log(sedeId);
    const converteSedeIdToString = sedeId.toString();
    localStorage.setItem('SedeEscolhidaId', converteSedeIdToString);
  }

  salvarMotoboyId(sedeId: number) {
    console.log(sedeId);
    const converteMotoboyIdToString = sedeId.toString();
    localStorage.setItem('motoboyEscolhidoId', converteMotoboyIdToString);
  }

  trocaDeTema(event: any) {
    this.cookieService.delete('NovoCorTema');
    this.corDoTemaAtual = event.detail.checked;

    if (this.corDoTemaAtual) {
      document.body.setAttribute('color-theme', 'dark');
      this.cookieService.set('NovoCorTema', this.corDoTemaAtual.toString());
    } else {
      document.body.setAttribute('color-theme', 'light');
      this.cookieService.set('NovoCorTema', this.corDoTemaAtual.toString());
    }
  }

  async abrirModalEscolhaServico() {
    const openModal = await this.modalCtrl.create({
      component: EscolhaServicoModalPage,
      cssClass: "EscolhaClienteModal"
    });

    await openModal.present();
  }

  async openModalSeach() {
    const modal = await this.modalCtrl.create({
      component: NavbarPage,
      cssClass: ''
    });

    await modal.present();
  }
}
