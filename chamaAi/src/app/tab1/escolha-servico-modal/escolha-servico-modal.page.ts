import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonModal, ModalController } from '@ionic/angular';
import { ModalCorridaPage } from 'src/app/modal-corrida/modal-corrida.page';
import { ModalEntregaPage } from 'src/app/modal-entrega/modal-entrega.page';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-escolha-servico-modal',
  templateUrl: './escolha-servico-modal.page.html',
  styleUrls: ['./escolha-servico-modal.page.scss'],
})
export class EscolhaServicoModalPage implements OnInit {

  constructor(
    private router: Router,
    private modalCtrl: ModalController) {  }

  ngOnInit() {
  }

  buttonBack() {
    this.router.navigateByUrl('tabs')
  }

  async openEntrega() {
    const modal = await this.modalCtrl.create({
      component: ModalEntregaPage,
      cssClass: 'Entrega'
    });
    modal.present();
  }

  async openCorrida() {
    const modal = await this.modalCtrl.create({
      component: ModalCorridaPage,
      cssClass: 'Entrega'
    });
    modal.present();
  }
}
