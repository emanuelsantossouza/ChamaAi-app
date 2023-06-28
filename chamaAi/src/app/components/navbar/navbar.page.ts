import { ModalController } from '@ionic/angular';
import { SedeService } from './../../services/sede.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {
  isModalOpen = false;

  listaDadosSede: any[] = [];
  pesquisa: string = "";

  constructor(
    private SedeDados: SedeService,
    private modalCtrl: ModalController) {
    this.BuscarDadosPesquisa(this.pesquisa);
  }

  BuscarDadosPesquisa(nomeSede: string): void {
    this.SedeDados.BuscarDadosSedePorNome(nomeSede).subscribe((dados) => {
      console.log(dados);
      this.listaDadosSede = dados;
    })
  }

  async buscarFilmes(event: any) {
    const busca: string = event.target.value;
    await this.SedeDados.BuscarDadosSedePorNome(busca).subscribe((dados) => {
      this.listaDadosSede = dados;
    })
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() { }
}
