import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { register } from 'swiper/element/bundle';
import { Pedido } from '../models/pedido';
import { PedidoService } from '../services/pedido.service';
register();

@Component({
  selector: 'app-modal-corrida',
  templateUrl: './modal-corrida.page.html',
  styleUrls: ['./modal-corrida.page.scss'],
})
export class ModalCorridaPage implements OnInit {
  nivelDoCadastro: number = 1;

  mapsSelecionado!: string;
  chatSelecionado!: string;

  contadorClickMaps: number = 1;
  contadorClickChat: number = 0;

  entregaPrimeiraFase: boolean = true;
  entregaSegundaFase: boolean = false;

  informacoesPedidoCorridaFormaDePagamento: FormGroup;
  usuarioId: number;
  sedeId: number;
  pedirPeloTabsCorrida!: boolean;

  horaDoPedido!: string
  iniciandoPedido!: Pedido;
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private alertController: AlertController,
    private pedidoService: PedidoService
  ) {

    this.informacoesPedidoCorridaFormaDePagamento = this.fb.group({
      formaDePagamento: ['', Validators.required],
    });

    const convertUsuarioIdToNumber = parseInt(cookieService.get('userId'));
    this.usuarioId = convertUsuarioIdToNumber;

    const convertSedeIdToNumber = parseInt(localStorage.getItem('SedeEscolhidaId')!);
    this.sedeId = convertSedeIdToNumber;
  }

  ngOnInit() {
  }

  buttonBack() {
    this.modalCtrl.dismiss();
  }


  selecionadoMaps() {
    if (this.contadorClickMaps % 2 == 1) {
      this.mapsSelecionado = 'tipoDeServicoSelecionado';
      this.contadorClickMaps++;
      this.chatSelecionado = '';
    } else {
      this.mapsSelecionado = '';
      this.contadorClickMaps++;
    }
  }

  selecionadoChat() {
    if (this.contadorClickChat % 2 == 0) {
      this.chatSelecionado = 'tipoDeServicoSelecionado';
      this.contadorClickChat++;
      this.mapsSelecionado = '';
    } else {
      this.chatSelecionado = '';
      this.contadorClickChat++;
    }
  }


  async prosseguirPedido() {
    if (this.contadorClickChat % 2 == 0 && this.informacoesPedidoCorridaFormaDePagamento.valid) {

      this.pedirPeloTabsCorrida = true;
      const convertPedidoTabs = this.pedirPeloTabsCorrida.toString();
      localStorage.setItem('PedirPeloTabsCorrida', convertPedidoTabs);

      this.pedidoService.CreatePedidoUsuarioParaSede(this.preparaValoresApi()).subscribe((dados) => {
        console.log(dados);
        const convertPedidoId = dados.id?.toString();
        localStorage.setItem('PedidoId', convertPedidoId!);
      });

      const titulo = 'Tudo certo!'
      const msg = 'Estamos preparando o seu pedido, falta pouco'
      this.sucessoAlert(titulo, msg);

      this.modalCtrl.dismiss();
      this.router.navigateByUrl('tabs/tab2');
    } else {
      this.pedirPeloTabsCorrida = true;
      const convertPedidoTabs = this.pedirPeloTabsCorrida.toString();
      localStorage.setItem('PedirPeloTabsCorrida', convertPedidoTabs);

      this.pedidoService.CreatePedidoUsuarioParaSede(this.preparaValoresApi()).subscribe((dados) => {
        console.log(dados);
        const convertPedidoId = dados.id?.toString();
        localStorage.setItem('PedidoId', convertPedidoId!);
      });
      this.modalCtrl.dismiss();
      this.router.navigateByUrl('tabs/tab3');
    }
  }


  preparaValoresApi() {
    this.horaClienteFezPedido();

    console.log(this.informacoesPedidoCorridaFormaDePagamento.controls['formaDePagamento'].value);

    this.iniciandoPedido = {
      usuarioId: this.usuarioId,
      sedeId: this.sedeId,
      localizacaoClienteDestino: {
        latitude: 0,
        longitude: 0
      },
      localizacaoClienteOrigem: {
        latitude: 0,
        longitude: 0
      },
      horaPedidoCliente: this.horaDoPedido,
      formaDePagamento: this.informacoesPedidoCorridaFormaDePagamento.controls['formaDePagamento'].value,
      qualServico: {
        corrida: true,
        entrega: false
      }
    };

    this.pedirPeloTabsCorrida = true;
    const convertPedidoTabs = this.pedirPeloTabsCorrida.toString();
    localStorage.setItem('PedirPeloTabsCorrida', convertPedidoTabs);

    return this.iniciandoPedido
  }

  async sucessoAlert(titulo: string, msg: string) {
    const alert = await this.alertController.create({
      header: `${titulo}`,
      message: `${msg}`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // // Essa função adiciona um 0 caso a hora ou o dia atual fore menores que 0
  formatarNumeroHora(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  // Essa função ele converte o tipo date para o formato de horas do padrão brasileito dd/MM/yy - hh:mm
  horaClienteFezPedido() {
    const horaAtualAqui = new Date();

    const hora = horaAtualAqui.getHours();
    const minutos = horaAtualAqui.getMinutes();
    const dia = horaAtualAqui.getDate();
    const mes = horaAtualAqui.getMonth() + 1; // Os meses são indexados a partir de 0, então é necessário adicionar 1
    const ano = horaAtualAqui.getFullYear();

    const horaFormatada = `${this.formatarNumeroHora(dia)}/${this.formatarNumeroHora(mes)}/${ano} - ${this.formatarNumeroHora(hora)}:${this.formatarNumeroHora(minutos)}`;
    this.horaDoPedido = horaFormatada;

    console.log("Hora do pedido!!" + this.horaDoPedido);
  }
}
