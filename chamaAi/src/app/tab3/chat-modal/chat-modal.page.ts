import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { Sede } from 'src/app/models/Sede';
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
  mensageUsuario!: Mensagem;

  dadosParaApi!: MensagemParaApi;
  clienteId: number;
  horaDMensagem?: string
  mensagemRecebidaApi?: string
  horaParaFront: any;

  sedeEscolhidaId: number;

  margemDinamicaUsuario!: string
  margemDinamicaNUsuario!: string

  listaDadosHtmlSede: Sede[] = [];
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







    this.listaDadosHtmlSede = [
      {
        id: 1,
        logo: 'https://img.elo7.com.br/product/main/4418282/logomarca-tema-motoboy-arte.jpg',
        endereco: 'R. Maj. Pompeu - Centro',
        nome: 'Motokas Center',
        localizacaoSede: {
          latitude: -22.497647,
          longitude: -48.557697,
        },
      },
      {
        id: 2,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/Chamou.Chegou%20Motos.png',
        endereco: 'R.Salvador de Toledo - Centro',
        nome: 'Chegou Motos',
        localizacaoSede: {
          latitude: -22.496132,
          longitude: - 48.559654,
        },
      },
      {
        id: 3,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/motosExpress%20(1).png',
        endereco: '261 R. Ângelo Reginato',
        nome: 'Motos Express',
        localizacaoSede: {
          latitude: 22.490615,
          longitude: - 48.563118,
        },
      },
      {
        id: 4,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/VelozMotos.png',
        endereco: 'R. Antônio Destro - Sonho nosso',
        nome: 'Veloz Motos',
        localizacaoSede: {
          latitude: -22.467396,
          longitude: - 48.561526,
        },
      },
      {
        id: 5,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/MotoLigeiro.png',
        endereco: 'R.Francisco Martins - Sonho nosso 5',
        nome: 'Motos Ligueirinho',
        localizacaoSede: {
          latitude: -22.460819,
          longitude: - 48.566459,
        },
      },
      {
        id: 6,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/MotoFacil.png',
        endereco: 'R.Joaquim Angelo Momesso - Vila Hab',
        nome: 'Moto Facil',
        localizacaoSede: {
          latitude: -22.491509,
          longitude: -48.546242,
        },
      },
      {
        id: 7,
        logo: 'https://img.elo7.com.br/product/360x360/4418247/logomarca-tema-motoboy-arte.jpg',
        endereco: 'R.Augusto da Silva - Nova Barra',
        nome: 'Motos Flash',
        localizacaoSede: {
          latitude: -22.484631,
          longitude: - 48.573221,
        },
      },
      {
        id: 8,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/MotoAs.png',
        endereco: 'R.Hilário Parezan - CECAP',
        nome: 'Motos Agies',
        localizacaoSede: {
          latitude: -22.483528,
          longitude: -48.563805,
        },
      },
    ]
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
    this.sedeBuscaPeloUsuarioApi = this.listaDadosHtmlSede[this.sedeEscolhidaId -1]
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

    const dateNow = new Date();
    const hora = dateNow.getHours();
    const minutos = dateNow.getMinutes();

    const horaFormatada = `${this.formatarNumeroHora(hora)}:${this.formatarNumeroHora(minutos)}`;

    this.mensageUsuario = {
      date: horaFormatada,
      message: this.message,
      user: '',
    }

    this.messages.push(this.mensageUsuario);





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
