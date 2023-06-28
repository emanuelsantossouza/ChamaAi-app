import { UserService } from 'src/app/services/cliente.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.page.html',
  styleUrls: ['./register-modal.page.scss'],
})
export class RegisterModalPage implements OnInit {
  titulo: string = '';
  msg: string = '';
  marcadoTermos: boolean = false;
  informacoesContato: boolean = true;
  nivelDoCadastro: number = 1;
  formulario: FormGroup;
  colorInput: string = ''

  isUsuarioLogado!: boolean;

  constructor(private modalCtrl: ModalController,
    private formularioBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController) {
    this.formulario = this.formularioBuilder.group({
      nomeCompleto: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      telefone: ['', Validators.compose([Validators.required, Validators.minLength(11)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(6)])],
      dataDNascimento: ['', Validators.required],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirmaSenha: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });
  }


  get nomeCompleto() {
    return this.formulario.get('nomeCompleto');
  }

  get telefone() {
    return this.formulario.get('telefone');
  }
  get email() {
    return this.formulario.get('email');
  }
  get dataDNascimento() {
    return this.formulario.get('dataDNascimento');
  }
  get senha() {
    return this.formulario.get('senha');
  }
  get confirmaSenha() {
    return this.formulario.get('confirmaSenha');
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

    dataDNascimento: [
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

  name?: string;


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  async salvarCadastro() {
    if (this.formulario.valid) {
      const usuario: Usuario = this.formulario.value;
      console.log(` ${usuario.senha} e ${usuario.confirmaSenha}`)
      if (usuario.senha == usuario.confirmaSenha) {
        this.userService.SalvarTodos(usuario).subscribe((resultado) => {
          console.log(resultado);
          this.titulo = 'Salvo com Sucesso';
          this.msg = 'Realize o login para acessar a sua conta!!!';
          this.sucessoAlert(this.titulo, this.msg);
          this.showLoading();
          this.isUsuarioLogado = true;
          const converteIsUsuarioLogadoToString = this.isUsuarioLogado.toString();
          localStorage.setItem('isUsuarioLogadoMobile', converteIsUsuarioLogadoToString);
          this.modalCtrl.dismiss();
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

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Salvando...',
      duration: 800,
      cssClass: 'custom-loading',
    });

    loading.present();
  }

  event(event: any) {
    console.log(event)

    if (event.detail.checked)
      this.marcadoTermos = true;
    else {
      this.marcadoTermos = false;
    }
  }


  nivelDoisCadastro() {
    this.nivelDoCadastro = 2;
    this.informacoesContato = false;
  }

  ColorInput() {
    if (this.colorInput) { }
  }

  eventInput(event: any) {
    console.log(event)
  }
}
