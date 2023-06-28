import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { Sede } from '../models/Sede';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class SedeService {
  url: string = 'https://localhost:7294/Sede'

  constructor(private http: HttpClient,
    private alertCtnl: AlertController) { }

  BuscarDadosSede(): Observable<Sede[]> {
    return this.http.get<Sede[]>(this.url).pipe(
      map((error) => error),
      catchError((error) => this.exibirError(error))
    );
  }

  BuscarDadosSedePorNome(nomeSede: string): Observable<Sede[]>{
    return this.http.get<Sede[]>(`${this.url}/PegarPorNomeSede?Nome=${nomeSede}`).pipe(
      map((error) => error),
      catchError((error) => this.exibirError(error))
    );
  }

  BuscarDadosPorId(id: number): Observable<Sede>{
    return this.http.get<Sede>(`${this.url}/${id}`)
  }


  exibirError(erro: any): Observable<any> {
    const titulo = "Erro na conexão!"
    const msg = `Verifique a sua conexão ou informe ao suporte o erro: ${erro.status}`;;

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
