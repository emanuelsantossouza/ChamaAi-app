import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/cliente.service';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { CookieService } from 'ngx-cookie-service';
import { FotoService } from '../../../services/foto.service';
import { Photo } from '@capacitor/camera';
import { Foto } from 'src/app/interface/foto.interfaces';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  listaCliente!: Usuario;
  fotoPerfilPadrao: string = '';
  isFotoPerfil!: boolean;

  constructor(
    private usuario: UserService,
    private router: Router,
    private cookies: CookieService,
    public fotoService: FotoService) {

    const cookieServidor = this.cookies.get("userId");
    const convertcookieStringToNumber = parseInt(cookieServidor);
    this.buscarCliente(convertcookieStringToNumber);

    this.isFotoPerfil = Boolean(localStorage.getItem('isFotoDePerfil'));
  }

  buscarCliente(id: number) {
    this.usuario.PegarPeloId(id).subscribe((dados) => {
      this.listaCliente = dados;
      console.log(this.listaCliente);
    })
  }

  alterarCliente() {
    this.router.navigateByUrl(`/alterar-usuario`)
  }

  ngOnInit() { }

  tirarFotoDePerfilUsuario() {
    this.fotoService.tirarFoto(this.listaCliente);
    this.isFotoPerfil = false;
    this.isFotoPerfil = true;


    const converteIsFotoDePerfilToString = this.isFotoPerfil.toString();
    localStorage.setItem('isFotoDePerfil', converteIsFotoDePerfilToString);
  }
}
