import { Injectable } from '@angular/core';
import { Observable, EMPTY, catchError, map } from 'rxjs';
import { Motoboy } from '../models/motoboy';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MotoboyService {

  url: string = "https://localhost:7294/api/Motoboy"
  constructor(private http: HttpClient,
    private alertCtnl: AlertController) { }

  BuscarDadosMotoboy(): Observable<Motoboy[]> {
    return this.http.get<Motoboy[]>(this.url).pipe(
      map(retorno => retorno),
      catchError((erro) => {
        return this.exibirError(erro);
      })
    )
  }

  BuscarDadosMotoboyPorId(motoboyId: number): Observable<Motoboy> {
    const urlApi = `${this.url}/${motoboyId}`;
    return this.http.get<Motoboy>(urlApi)
  }


  exibirError(erro: any): Observable<any> {
    const titulo = "Erro na conexão!"
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
