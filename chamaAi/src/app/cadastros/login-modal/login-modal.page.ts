import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { Usuario } from 'src/app/models/usuario';
import { UserService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {

  titulo = '';
  msg = '';

  formLogin!: FormGroup;

  nameUser: string = '';
  isUsuarioLogado!: boolean;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private usuarioSede: UserService,
    private route: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private cookieService: CookieService
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });


    this.isUsuarioLogado = true;
    const converteIsUsuarioLogadoToString = this.isUsuarioLogado.toString();
    localStorage.setItem('isUsuarioLogadoMobile', converteIsUsuarioLogadoToString);
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

  mensagemErro = {
    email: [
      { tipo: 'required', aviso: 'Digite um e-mail!' },
      { tipo: 'email', aviso: 'Tem que ser um e-mail!' },
    ],
    senha: [
      { tipo: 'required', aviso: 'Digite uma senha!' },
      { tipo: 'minlength', aviso: 'No mínimo 8 dígitos!' },
    ],
  };


  get email() {
    return this.formLogin.get('email');
  }

  get senha() {
    return this.formLogin.get('senha');
  }

  async login() {
    if (this.formLogin.valid) {

      const email = this.formLogin.get('email')?.value;
      const senha = this.formLogin.get('senha')?.value;


      const usuario: Usuario = await this.usuarioSede.login(email, senha) as Usuario;

      if (usuario) {
        this.showLoading();
        // redirecionar para página principal
        this.route.navigateByUrl(`/tabs`);
        // exibir toast de boas-vindas
        this.presentToast("bottom");
        // Salando o cookie
        this.modalCtrl.dismiss();
        this.cookieService.set('userId', usuario.id!.toString());
        this.cookieService.set('NameUser', usuario.nomeCompleto!);
      } else {
        this.titulo = 'E-mail ou Senha inválidos!';
        this.msg = "Por favor, verifique se os campos de email ou senha estão corretos.";
        this.presentAlert(this.titulo, this.msg);

      }
    } else {
      this.titulo = "Por favor, preencha todos campos do formulario";
      this.msg = "Por favor, verifique se todos os campos do login estão preenchidos corretamente";
      this.presentAlert(this.titulo, this.msg);
    }
  }

  async presentAlert(titulo: string, msg: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Seja Bem-vindo!!!',
      duration: 2000,
      position: position
    });

    await toast.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Buscando Informações...',
      duration: 800,
      cssClass: 'custom-loading',
    });
    loading.present();
  }
}
