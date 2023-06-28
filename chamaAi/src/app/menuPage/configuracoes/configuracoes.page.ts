import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
})
export class ConfiguracoesPage implements OnInit {

  constructor(
    private alertCtrl:AlertController,
    private clienteServe: UserService,
    private cookiesService: CookieService,
    private router: Router,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {

  }

  sairDoAplicativo() {
    this.cookiesService.deleteAll();
    localStorage.clear();
    this.router.navigateByUrl('login');
  }

  apagarLocalStorage(nomeItem: string) {
    localStorage.removeItem(nomeItem);
  }

  apagarConta(){
    const usuarioID = this.cookiesService.get("userId");
    this.clienteServe.ExcluirUsuario(parseInt(usuarioID));
    this.router.navigateByUrl("/login");
    this.cookiesService.deleteAll();
    this.confirmacaoToast()
  }

  async confirmacaoExcluirConta() {
    const chamaAlert = await this.alertCtrl.create({
      header: "Esta insatifeito com algo?",
      message: "Tem certeza disso?",
      buttons: [
        {
          text: "Excluir",
          handler: () => this.apagarConta(),
        },
        {
          text: "Cancelar"
        }
      ]
    })
    chamaAlert.present()
  }

  async confirmacaoToast() {
    const chamaToast = await this.toastCtrl.create({
      duration: 1500,
      header: "Contar Excuilda com successo!",
      message: "Pedimos desculpar por qualquer frustração que causamo!"
    });
    chamaToast.present();
  }
}
