import { Injectable } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Mensagem } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;
  user!: any;
  userId: any;
  message: string | null | undefined
  messages: Mensagem[] = [];

  constructor(
    public navCtrl: NavController,
    private toats: ToastController,
    private cookieService: CookieService,
    private modalCtrl: ModalController) {
    // Criar a instância e cors do socket.io-client
    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
      withCredentials: true,
      extraHeaders: {
        'Access-Control-Allow-Origin': 'http://localhost:8100',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

    // informando status, 'conectado' ou 'desconectado' e passando um usuario
    this.pegarUsuarioConectado().subscribe((data: any) => {
      this.presentToast(`Usuario: ${data.user} esta ${data.event}`);
    });

    this.pegarMensagem().subscribe((messagem: any) => {
      this.messages.push(messagem)
    })
  }

  conectarUsuarioSocket(user: any) {
    // conectado usuario com o services do socket.io
    this.socket?.connect();
    this.socket?.emit("user-conected", user)
  }

  // Pegando usuario conectados e informando estado atual connetado ou desconetado
  pegarUsuarioConectado() {
    let obersevable = new Observable(observer => {
      this.socket?.on("users-changed", data => {
        observer.next(data);
        console.log(data);
      });
    })

    return obersevable;
  }

  // Pegando mensagem enviadas por outros usuarios
  pegarMensagem() {
    let observable = new Observable(observer => {
      this.socket?.on("message", data => {
        observer.next(data);
        console.log(data);
      });
    });

    return observable;
  }

  //Enviado mensagem, enviado a mensagem, o usario e data
  enviarMensagem(user: any, msg: string, id: any) {
    this.socket?.emit("message",
      { user: user, message: msg, userId: id, date: new Date() })
  }

  conectarUsuarioChatPrivado(userName:any) {
    this.socket?.emit('entrarChatPrivado', userName);
  }

  enviarMensagemChatPrivado(mensagem:any) {
    this.socket?.emit('mensagemSalaPrivada', mensagem);
  }

  async presentToast(msg: string) {
    const toast = await this.toats.create({
      message: msg,
      duration: 3000
    });

    await toast.present()
  }

}
