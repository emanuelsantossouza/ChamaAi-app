import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { Usuario } from '../models/usuario';
import { AlertController } from '@ionic/angular';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private url = 'https://localhost:7294/Cliente'



  constructor(private http: HttpClient,
    private alertCtrl: AlertController) { }

  public PegarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url).pipe(
      map(retorno => retorno),
      catchError((error) => this.exibirError(error))
    );
  }

  public PegarPeloId(usuarioId: number): Observable<Usuario> {
    const apiUrl = `${this.url}/${usuarioId}`;
    return this.http.get(apiUrl).pipe(
      map(retorno => retorno),
      catchError((error) => this.exibirError(error))
    );
  };


  public SalvarTodos(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario, httpOptions)

  };


  public AtualizarUsuario(usuario: Usuario, id: number): Observable<Usuario> {
    const apiUrl = `${this.url}/${id}`
    return this.http.put<Usuario>(apiUrl, usuario, httpOptions).pipe(
      map(retorno => retorno),
      catchError((error) => this.exibirError(error))
    );
  }


  public ExcluirUsuario(usuarioId: number): Observable<Usuario> {
    const apiUrl = `${this.url}/${usuarioId}`;
    return this.http.delete<Usuario>(apiUrl, httpOptions).pipe(
      map(retorno => {
        console.log(`Usuario excluido com sucesso ${retorno}`)
      }),
      catchError((error) => this.exibirError(error))
    );
  };


  async login(email?: string, senha?: string): Promise<Usuario | null> {

    try {
      //Buscando os dados
      const usuarios = await this.PegarTodos().toPromise();

      //Fazendo o filtro e testando o email
      const usuario = usuarios?.find(u => u.email?.toLocaleLowerCase() === email?.toLocaleLowerCase());

      // testando a senha
      if (usuario && usuario.senha === senha) {
        return usuario;
      }
      return null;
    } catch (error) {
      console.log(`Ocorreu un erro ${error}`)
      return null;
    }
  };


  alteraFoto(clienteId: number, usuario:Usuario): Observable<Usuario> {
    const urlApi = `${this.url}/${clienteId}`;
    return this.http.put<Usuario>(urlApi, usuario, httpOptions);
  }

  exibirError(erro: any): Observable<any> {
    const titulo = "Erro na conexão!"
    const msg = `Verifique a sua conexão ou informe ao suporte o erro: ${erro.status}`;;

    this.presentAlert(titulo, msg);

    return EMPTY;
  }

  async presentAlert(titulo: string, msg: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: msg,
      buttons: ['OK'],
    })
    alert.present();
  }
}
