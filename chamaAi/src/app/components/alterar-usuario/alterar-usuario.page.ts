import { CookieService } from 'ngx-cookie-service';
import { Usuario } from './../../models/usuario';
import { UserService } from '../../services/cliente.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {
  id!: number;
  nomeCompleto: string = "";
  email: string = "";
  telefone: string = "";
  dataDNascimento?: Date;
  tipo: number = 0;
  senha: string = "";
  confirmarSenha: string = "";

  usuario!: Usuario;
  salvaCookieId!: number;

  constructor(private userService: UserService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private cookies: CookieService) { }

  ngOnInit() {
    const cookieServidor = this.cookies.get("userId");
    const convertcookieStringToNumber = parseInt(cookieServidor);
    this.salvaCookieId = convertcookieStringToNumber;
    this.userService.PegarPeloId(convertcookieStringToNumber).subscribe((dados) => {

      this.nomeCompleto = dados.nomeCompleto as string;
      this.email = dados.email as string;
      this.telefone = dados.telefone as string;
      this.senha = dados.senha as string
      this.confirmarSenha = dados.confirmaSenha as string;

      this.usuario = dados;
    })
  }


  alterarUsuario(usuario: Usuario, id: number) {
    this.userService.AtualizarUsuario(usuario, usuario.id!).subscribe((dados => {
      console.log(dados);
    }))
  }

  salvarNovasInformacoesCliente() {
    if (this.senha === this.confirmarSenha) {
      this.usuario = {
        id: this.salvaCookieId,
        nomeCompleto: this.nomeCompleto,
        email: this.email,
        telefone: this.telefone,
        senha: this.senha,
        confirmaSenha: this.confirmarSenha,
      };

      console.log(this.usuario)
      this.userService.AtualizarUsuario(this.usuario, this.salvaCookieId).subscribe((dados) => {
        console.log(dados);
        alert("Alterado " + dados.nomeCompleto)
      })
    } else {
      console.log("Error!! Confirmar senha incorreto")
    }
  }
}
