import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { Mensagem, MensagemParaApi } from 'src/app/models/message';
import { ChatService } from 'src/app/services/chat.service';
import { SedeService } from 'src/app/services/sede.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.page.html',
  styleUrls: ['./chat-modal.page.scss'],
})
export class ChatModalPage implements OnInit {

  message!: string;
  user!: string
  url: string = 'https://localhost:7294/Sede'
  sedeBuscaPeloUsuarioApi!: any
  textSede!: string
  messages: Mensagem[] = [];

  dadosParaApi!: MensagemParaApi;
  clienteId: number;
  horaDMensagem?: string
  mensagemRecebidaApi?: string
  horaParaFront: any;

  sedeEscolhidaId: number;

  margemDinamicaUsuario!: string
  margemDinamicaNUsuario!: string
  constructor(
    private modalCtrl: ModalController,
    private cookieService: CookieService,
    private socketService: SocketService,
    private chatService: ChatService,
    private sedeServices: SedeService,
    private toastCtrl: ToastController
  ) {
    this.clienteId = parseInt(this.cookieService.get('userId'));
    this.user = this.cookieService.get('NameUser');
    this.conectarUsuarioSockerChat();
    this.statusDeConexaoEventosSocket();
    this.pegarMensagemAqui();


    const converteSedeIdToNumber = parseInt(localStorage.getItem('SedeEscolhidaId')!);
    this.sedeEscolhidaId = converteSedeIdToNumber;
  }

  async ngOnInit() {
    await this.buscarMensagemAnteriores();

  }

  async ionViewWillEnter() {
    console.log('Buscando dados')
    console.log(this.sedeEscolhidaId);
    await this.buscarContato();
  }

  // buscando conversas anteriores no banco de dados
  buscarContato() {
    this.sedeServices.BuscarDadosPorId(this.sedeEscolhidaId).subscribe((results) => {
      this.sedeBuscaPeloUsuarioApi = results;
    })
  }

  // buscando conversas anteriores no banco de dados
  buscarMensagemAnteriores() {
    this.chatService.BuscarMensagensSalvas(1);
  }


  // Recebendo a mensagem e atribuindo para o array para ser exibida na tela
  async pegarMensagemAqui() {
    await this.socketService.pegarMensagem().subscribe((mensagenRecebida: any) => {

      mensagenRecebida.date = new Date();

      const hora = mensagenRecebida.date.getHours();
      const minutos = mensagenRecebida.date.getMinutes();
      const dia = mensagenRecebida.date.getDate();
      const mes = mensagenRecebida.date.getMonth() + 1;
      const ano = mensagenRecebida.date.getFullYear();

      const horaFormatada = `${this.formatarNumeroHora(dia)}/${this.formatarNumeroHora(mes)}/${ano} - ${this.formatarNumeroHora(hora)}:${this.formatarNumeroHora(minutos)}`;

      this.horaParaFront = `${this.formatarNumeroHora(hora)}:${this.formatarNumeroHora(minutos)}`;
      console.log(this.horaParaFront)

      this.horaDMensagem = horaFormatada

      this.mensagemRecebidaApi = mensagenRecebida.msg;

      console.log("Hora do pedido!!" + horaFormatada);

      mensagenRecebida.date = horaFormatada;
      console.log("mensagen Recebida date!!" + mensagenRecebida.date);
      this.messages.push(mensagenRecebida);

      console.log(mensagenRecebida.userId);
      this.contarCaracteresNUsuario(mensagenRecebida.msg);
    })
  }

  // Conctando no servido e informando o nome do usuario
  conectarUsuarioSockerChat() {
    this.socketService.conectarUsuarioSocket(this.user);
  }

  // informando status, 'conectado' ou 'desconectado' e passando um usuario e imprimindo um toast
  statusDeConexaoEventosSocket() {
    this.socketService.pegarUsuarioConectado().subscribe((data: any) => {
      this.presentToast(`Usuario: ${data.user} esta ${data.event}`);
    });
  }

  // Enviando mensagem para outro usuario
  async enviarMensagem() {
    await this.socketService.enviarMensagem(this.user, this.message, this.clienteId);

    this.dadosParaApi = {
      mensagens: {
        user: this.user,
        data: "5:00",
        msg: this.message // corrigido de 'mensagemRecebidaApi' para 'msg'
      },
      SedeId: 1,
      clienteId: this.clienteId,
    }
    console.log(this.dadosParaApi);
    // Realize a conversão da data aqui, se necessário
    await this.chatService.SalvarNovasMensagens(this.dadosParaApi);
    console.log(this.messages)
    this.message = '';
  }

  //Voltar para a tela anterio
  voltarPreChat() {
    this.modalCtrl.dismiss();
  }
  // Pegando o que o usuario escreveu e atribuindo para a variavel mensagem
  EscritoUsuario(event: any) {
    console.log(event.target.value);
    this.message = event.target.value;
    this.contarCaracteresUsuario(this.message);
  }

  conectarUsuarioChatPrivado() {
    this.socketService.conectarUsuarioChatPrivado(this.user);
  }

  enviarMensagemParaChatPrivado() {
    this.socketService.enviarMensagemChatPrivado(this.message);
  }

  contarCaracteresUsuario(mensagem: string) {
    const totalCaracteres = mensagem.length
    console.log(totalCaracteres);

    // Faça seus cálculos para determinar o tamanho da margem com base no total de caracteres
    if (totalCaracteres > 10) {
      this.margemDinamicaUsuario = 'margem-grande-Usuario';
    } else if (totalCaracteres >= 5) {
      this.margemDinamicaNUsuario = 'margem-media-Usuario';
    } else {
      this.margemDinamicaUsuario = 'margem-pequena-Usuario';
    }
  }

  contarCaracteresNUsuario(mensagem: string) {
    const totalCaracteres = mensagem.length
    console.log(totalCaracteres);

    // Faça seus cálculos para determinar o tamanho da margem com base no total de caracteres
    if (totalCaracteres > 10) {
      this.margemDinamicaNUsuario = 'margem-grande-NUsuario';
    } else if (totalCaracteres >= 5) {
      this.margemDinamicaNUsuario = 'margem-media-NUsuario';
    } else {
      this.margemDinamicaNUsuario = 'margem-pequena-NUsuario';
    }
  }


  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000
    });

    await toast.present()
  }

  formatarNumeroHora(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }
}
