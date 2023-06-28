import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mensagem, MensagemParaApi } from '../models/message';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  url: string = 'https://localhost:7294/api/Chat/';

  constructor(
    private http: HttpClient
  ) { }

  BuscarMensagensSalvas(id:number) {
    this.http.get(`${this.url}/${id}`);
  }


  SalvarNovasMensagens(msg: MensagemParaApi) {
    this.http.post(this.url, msg, httpOptions).subscribe((dados) =>{
      console.log(dados)
    })
  }
}
