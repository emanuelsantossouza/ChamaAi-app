import { Pedido } from './../models/pedido';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map, pipe } from 'rxjs';
import { AlertController } from '@ionic/angular';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  url: string = 'https://localhost:7294/Pedido'

  constructor(private http: HttpClient,
    private alertCtnl: AlertController) { }

  CreatePedidoUsuarioParaSede(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.url}`, pedido, httpOptions);
  }

  PegarPedidoUsuarioPorId(pedidoId: number): Observable<Pedido> {
    const urlApi = `${this.url}/${pedidoId}`;
    return this.http.get<Pedido>(`${urlApi}`);
  }

  AtualizarPedidoUsuarioParaSede(pedidoId: number, pedido: Pedido): Observable<Pedido> {
    const urlApi = `${this.url}/${pedidoId}`;
    return this.http.put<Pedido>(`${urlApi}`, pedido, httpOptions);
  }

  exibirError(erro: any): Observable<any> {
    const titulo = "Erro no Interno"
    const msg = `Verifique a sua conexão ou informe ao suporte o erro: ${erro.status}`;

    this.presentAlert(titulo, msg);

    return EMPTY;
  }

  async presentAlert(titulo: string, msg: string) {
    const alert = await this.alertCtnl.create({
      header: titulo,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
