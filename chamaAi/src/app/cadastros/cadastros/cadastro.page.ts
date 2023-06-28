import { UserService } from 'src/app/services/cliente.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})

export class CadastroPage implements OnInit {
  titulo: string = '';
  msg: string = '';

  formulario: FormGroup;



  constructor(
    private formularioBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.formulario = this.formularioBuilder.group({
      nomeCompleto: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      telefone: ['', Validators.compose([Validators.required, Validators.minLength(11)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(6)])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmaSenha: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });
  }



  mensagemErro = {
    nomeCompleto: [
      { tipo: 'required', aviso: 'Por favor, Digite seu Nome Completo!!!' },
      { tipo: 'minLenght', aviso: 'Por favor, Digite no mínimo 10 caracteres!!!' }
    ],

    telefone: [
      { tipo: 'required', aviso: 'Por favor, Digite um Número de Telefone!!!' },
      { tipo: 'minlength', aviso: 'Por favor, Digite no mínimo 11 caracteres!!!' },
    ],

    email: [
      { tipo: 'required', aviso: 'Por favor, Digite um E-mail!!!' },
      { tipo: 'email', aviso: 'Por favor, Digite um E-mail Válido!!!' },
      { tipo: 'minlength', aviso: 'Por favor, Digite no mínimo 6 caracteres!!!' },
    ],

    senha: [
      { tipo: 'required', aviso: 'Por favor, Digite uma senha!!!' },
      { tipo: 'minlength', aviso: 'Por favor, Digite no mínimo 8 dígitos!!!' },
    ],

    confirmaSenha: [
      { tipo: 'required', aviso: 'Por favor, Digite Confirme a senha!!!' },
      { tipo: 'minlength', aviso: 'Por favor, Digite no mínimo 8 dígitos!!!' },
    ],
  }

  ngOnInit() {
  }

  async salvarCadastro() {
    if (this.formulario.valid) {
      const usuario: Usuario = this.formulario.value;
      console.log(` ${usuario.senha} e ${usuario.confirmaSenha}`)
      if (usuario.senha == usuario.confirmaSenha) {
        this.userService.SalvarTodos(usuario).subscribe((resultado) => {
          resultado
          this.router.navigateByUrl('/login');
          this.titulo = 'Salvo com Sucesso';
          this.msg = 'Realize o login para acessar a sua conta!!!';
          this.sucessoAlert(this.titulo, this.msg);
          this.showLoading();
        });
      } else {
        this.titulo = 'Confirmar senha Incorreto!!!';
        this.msg = 'Por favor, verifiquei se o confirmar senha está igual a senha.';
        this.sucessoAlert(this.titulo, this.msg);
      }
    } else {
      this.titulo = 'Formulario Invalido!';
      this.msg = 'Por favor, preencha o formulario.';
      this.sucessoAlert(this.titulo, this.msg);
    }
  }


  async sucessoAlert(titulo: string, msg: string) {
    const alert = await this.alertController.create({
      header: `${titulo}`,
      message: `${msg}`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  loginGoogle() { }

  loginFace() { }


  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Salvando...',
      duration: 800,
      cssClass: 'custom-loading',
    });

    loading.present();
  }
}
