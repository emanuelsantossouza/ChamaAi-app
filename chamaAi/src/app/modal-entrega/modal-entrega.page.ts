import { Pedido } from './../models/pedido';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { PedidoService } from '../services/pedido.service';
import { CookieService } from 'ngx-cookie-service';
register();

@Component({
  selector: 'app-modal-entrega',
  templateUrl: './modal-entrega.page.html',
  styleUrls: ['./modal-entrega.page.scss'],
})
export class ModalEntregaPage implements OnInit {
  nivelDoCadastro: number = 1;
  mapsSelecionado!: string;
  chatSelecionado!: string;

  contadorClickMaps: number = 1;
  contadorClickChat: number = 0;

  entregaPrimeiraFase: boolean = true;
  entregaSegundaFase: boolean = false;

  informacoesSobrePedidoCorrida: FormGroup;
  informacoesSobrePedidoEntregaFormaDePagamento: FormGroup;

  iniciandoPedido!: Pedido;
  usuarioId: number;
  sedeId: number;

  isFragilBoolean!: boolean;

  horaDoPedido: any

  pedirPeloTabsEntrega!: boolean;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private alertController: AlertController,
    private pedidoServico: PedidoService,
    private cookieService: CookieService) {
    this.informacoesSobrePedidoCorrida = this.fb.group({
      peso: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      tamanho: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      fragil: ['', Validators.required],
      descricao: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
    })

    this.informacoesSobrePedidoEntregaFormaDePagamento = this.fb.group({
      formaDePagamento: ['', Validators.required]
    });


    const convertUsuarioIdToNumber = parseInt(cookieService.get('userId'));
    this.usuarioId = convertUsuarioIdToNumber;

    const convertSedeIdToNumber = parseInt(localStorage.getItem('SedeEscolhidaId')!);
    this.sedeId = convertSedeIdToNumber;
  }

  ngOnInit() { }

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

  salvar() {
    if (this.informacoesSobrePedidoCorrida.valid) {
      this.entregaPrimeiraFase = false;
      this.entregaSegundaFase = true;
    } else {
      const titulo = 'Error no formulário';
      const msg = 'Por favor, preencha todos os campos do formulario para poder processeguir';
      this.sucessoAlert(titulo, msg);
      this.validateAllFormFields(this.informacoesSobrePedidoCorrida);
    }
  }

  async prosseguirPedido() {
    this.horaClienteFezPedido();
    if (this.informacoesSobrePedidoCorrida.controls['fragil'].value == 'Sim') {
      this.isFragilBoolean = true;
    } else {
      this.isFragilBoolean = false;
    }


    console.log(this.informacoesSobrePedidoCorrida.controls['tamanho'].value);
    console.log(this.informacoesSobrePedidoCorrida.controls['peso'].value);
    console.log(this.informacoesSobrePedidoCorrida.controls['descricao'].value);
    console.log(this.informacoesSobrePedidoCorrida.controls['fragil'].value);
    console.log(this.isFragilBoolean);
    console.log(this.informacoesSobrePedidoEntregaFormaDePagamento.controls['formaDePagamento'].value);



    this.iniciandoPedido = {
      usuarioId: this.usuarioId,
      sedeId: this.sedeId,
      localizacaoClienteDestino: {
        latitude: 112,
        longitude: 112
      },
      localizacaoClienteOrigem: {
        latitude: 333,
        longitude: 333
      },
      tamanhoProduto: this.informacoesSobrePedidoCorrida.controls['tamanho'].value,
      pesoProduto: this.informacoesSobrePedidoCorrida.controls['peso'].value,
      isFragil: this.isFragilBoolean,
      descricaoProduto: this.informacoesSobrePedidoCorrida.controls['descricao'].value,
      horaPedidoCliente: this.horaDoPedido,
      formaDePagamento: this.informacoesSobrePedidoEntregaFormaDePagamento.controls['formaDePagamento'].value,
      qualServico: {
        corrida: false,
        entrega: true
      }
    };

    this.pedirPeloTabsEntrega = true;
    const convertPedidoTabs = this.pedirPeloTabsEntrega.toString();
    localStorage.setItem('PedirPeloTabsCorrida', convertPedidoTabs);


    console.log(this.iniciandoPedido);
    if (this.contadorClickChat % 2 == 0 && this.informacoesSobrePedidoEntregaFormaDePagamento.valid) {
      this.pedidoServico.CreatePedidoUsuarioParaSede(this.iniciandoPedido).subscribe((dados) => {
        const convertPedidoId = dados.id?.toString();
        localStorage.setItem('PedidoId', convertPedidoId!);

        console.log(dados);
      });
      this.modalCtrl.dismiss();
      this.router.navigateByUrl('tabs/tab2');
    } else {
      this.pedidoServico.CreatePedidoUsuarioParaSede(this.iniciandoPedido).subscribe((dados) => {
        const convertPedidoId = dados.id?.toString();
        localStorage.setItem('PedidoId', convertPedidoId!);

        console.log(dados);
      });
      this.modalCtrl.dismiss();
      this.router.navigateByUrl('tabs/tab3');
    }
  }

  async sucessoAlert(titulo: string, msg: string) {
    const alert = await this.alertController.create({
      header: `${titulo}`,
      message: `${msg}`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
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
