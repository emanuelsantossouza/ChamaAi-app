import { Component, OnInit } from '@angular/core';
import { SedeService } from './../../services/sede.service';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.page.html',
  styleUrls: ['./pesquisa.page.scss'],
})
export class PesquisaPage implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // listaDadosSede: any[] = [];
  // pesquisa: string = "";

  // constructor(private SedeDados: SedeService) {
  //   this.BuscarDadosPesquisa(this.pesquisa);
  // }

  // ngOnInit()




  // BuscarDadosPesquisa(nomeSede: string): void {
  //   this.SedeDados.BuscarDadosSedePorNome(nomeSede).subscribe((dados) => {
  //     console.log(dados);
  //     this.listaDadosSede = dados;
  //   })
  // }

  // async buscarFilmes(event: any) {
  //   const busca: string = event.target.value;
  //   await this.SedeDados.BuscarDadosSedePorNome(busca).subscribe((dados) => {
  //     this.listaDadosSede = dados;
  //   })
  // }
}
