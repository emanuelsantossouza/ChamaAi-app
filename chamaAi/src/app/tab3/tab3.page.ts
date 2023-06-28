import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/cliente.service';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { CookieService } from 'ngx-cookie-service';
import { FotoService } from '../services/foto.service';
import { ModalController } from '@ionic/angular';
import { ChatModalPage } from './chat-modal/chat-modal.page';
import { NavbarPage } from '../components/navbar/navbar.page';
import { ChatService } from '../services/chat.service';
import { SedeService } from '../services/sede.service';
import { Sede } from '../models/Sede';
import { Motoboy } from '../models/motoboy';
import { MotoboyService } from '../services/motoboy.service';
import { min } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  listaCliente!: Usuario;
  fotoPerfilPadrao: string = ''
  chatComSede: boolean = true;
  corDoTemaAtual!: boolean;

  sedeEscolhidaId!: number;
  motoboyEscolhidoId!: number;

  dadosSedeEscolhidaHtml!: Sede;
  dadosMotoboyEscolhidaHtml!: Motoboy;

  salvarContatosSede: Sede[] = [];
  temNovaMensagemSede: boolean = false;
  temNovaMensagemMotoboy: boolean = false;
  constructor(
    private usuario: UserService,
    private router: Router,
    private cookiesService: CookieService,
    public fotoService: FotoService,
    private modalCtrl: ModalController,
    private chatService: ChatService,
    private sedeService: SedeService,
    private motoboyService: MotoboyService
  ) {
    this.corDoTemaAtual = Boolean(this.cookiesService.get('NovoCorTema'))
    if (this.corDoTemaAtual) {
      document.body.setAttribute('color-theme', 'dark')
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
  }

  async ngOnInit() {
    console.log('ngOnInit');
    // Pegando id da sede escolhida
    const converteSedeIdToNumber = parseInt(localStorage.getItem('SedeEscolhidaId')!);
    this.sedeEscolhidaId = converteSedeIdToNumber;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter')
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter')
    const converteSedeIdToNumber = parseInt(localStorage.getItem('SedeEscolhidaId')!);
    this.sedeEscolhidaId = converteSedeIdToNumber;

    const mensangeTabsCorrida = Boolean(localStorage.getItem('PedirPeloTabsCorrida'));
    const mensangeTabsEntrega = Boolean(localStorage.getItem('PedirPeloTabsEntrega'));

    if (mensangeTabsCorrida == true || this.sedeEscolhidaId >= 1) {
      this.temNovaMensagemSede = true;
      this.buscarSedeEscolhidaParaSede();
    } else if (mensangeTabsEntrega == true || this.motoboyEscolhidoId >= 1) {
      this.buscarMotoboyEscolhidaParaSede();
    }
  }

  ionViewDidLeave() {
    console.log(this.dadosSedeEscolhidaHtml);

    debugger;
    if (this.salvarContatosSede.length === 0) {
      console.log("Salvar Contato tamanho = 0");
      this.salvarContatosSede.push(this.dadosSedeEscolhidaHtml);
    } else if (Number.isNaN(this.sedeEscolhidaId)) {
      // Lógica para NaN
    } else {
      const index = this.salvarContatosSede.findIndex((sede) => sede.id === this.sedeEscolhidaId);

      if (index !== -1) {
        console.log("Tem id igual, vai apagar e adicionar o novo");
        this.salvarContatosSede.splice(index, 1);
      } else {
        this.salvarContatosSede.unshift(this.dadosSedeEscolhidaHtml);
      }
    }




    console.log(this.dadosSedeEscolhidaHtml);
    console.log(this.salvarContatosSede);
    localStorage.removeItem('SedeEscolhidaId');
    localStorage.removeItem('PedidoId');
    localStorage.removeItem('PedirPeloTabsEntrega');
    localStorage.removeItem('PedirPeloTabsCorrida');
    this.temNovaMensagemSede = false;
    this.temNovaMensagemMotoboy = false;
  }

  async pesquisar() {
    const modal = await this.modalCtrl.create({
      component: NavbarPage,
      cssClass: 'ChatModal',
    });

    modal.present();
  }

  chatComMotoboys() {
    this.chatComSede = false;
    console.log(this.chatComSede)
  }

  chatComSedes() {
    this.chatComSede = true;
    console.log(this.chatComSede)
  }

  async openChatComSede() {
    const modal = await this.modalCtrl.create({
      component: ChatModalPage,
      cssClass: 'ChatModal',
    });

    modal.present();
  }

  async openChatComMotoboy() {
    const modal = await this.modalCtrl.create({
      component: ChatModalPage,
      cssClass: 'ChatModal',
    });

    modal.present();
  }

  buscarSedeEscolhidaParaSede() {
    this.sedeService.BuscarDadosPorId(this.sedeEscolhidaId).subscribe((sedeEscolhidaDados) => {
      this.dadosSedeEscolhidaHtml = sedeEscolhidaDados;
      console.log(this.dadosSedeEscolhidaHtml);
      console.log(this.salvarContatosSede);
    })
  }

  buscarMotoboyEscolhidaParaSede() {
    this.motoboyService.BuscarDadosMotoboyPorId(this.sedeEscolhidaId).subscribe((motoboyEscolhidaDados) => {
      this.dadosMotoboyEscolhidaHtml = motoboyEscolhidaDados;
      console.log(this.dadosMotoboyEscolhidaHtml);
    })
  }

  horaDaMensagem() {
    const dateNow = new Date();

    const hora = dateNow.getHours();
    const minutos = dateNow.getMinutes();
    this.formatarNumeroHora(minutos);
    this.formatarNumeroHora(hora);

    const horaFormatada = `${hora}:${minutos}`;
    return horaFormatada;
  }

  formatarNumeroHora(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  trocaDeTema(event: any) {
    console.log(event)
    this.cookiesService.delete('NovoCorTema');
    console.log(this.corDoTemaAtual = event.detail.checked);

    // this.cookiesService.set('NovoCorTema', this.corDoTemaAtual.toString())


    // if (this.corDoTemaAtual) {
    //   document.body.setAttribute('color-theme', 'dark')
    // } else {
    //   document.body.setAttribute('color-theme', 'light');
    // }
  }

  buscarMensagensAnteriores() {
    this.chatService.BuscarMensagensSalvas(this.sedeEscolhidaId);
  }
}
