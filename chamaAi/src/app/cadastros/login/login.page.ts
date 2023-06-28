import { UserService } from '../../services/cliente.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { LoginModalPage } from '../login-modal/login-modal.page';
import { RegisterModalPage } from 'src/app/cadastros/register-modal/register-modal.page';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  titulo = '';
  msg = '';


  formLogin!: FormGroup;
  constructor(private toastController: ToastController,
    private formBuilder: FormBuilder,
    private usuarioSede: UserService,
    private route: Router,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private cookieService: CookieService,
    private modalCtrl: ModalController) {

    this.formLogin = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

  }



  get email() {
    return this.formLogin.get('email');
  }

  get senha() {
    return this.formLogin.get('senha');
  }

  ngOnInit() { }

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
        this.cookieService.set('userId', usuario.id!.toString());
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
      duration: 3000,
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

  message = 'This modal example uses the modalController to present and dismiss modals.';

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: LoginModalPage,
      cssClass: 'Login'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }
  async openRegisterModal() {
    const modal = await this.modalCtrl.create({
      component: RegisterModalPage,
      cssClass: 'Register'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }

  loginGoogle() { }

  LoginFace() {



  }
}


