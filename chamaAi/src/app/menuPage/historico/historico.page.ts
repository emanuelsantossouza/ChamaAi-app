import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // // Essa função adiciona um 0 caso a hora ou o dia atual fore menores que 0
  formatarNumeroHora(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  // // Essa função ele converte o tipo date para o formato de horas do padrão brasileito dd/MM/yy - hh:mm
  // horaClienteFezPedido() {
  //   const horaAtualAqui = new Pedido();
  //   horaAtualAqui.horaPedidoCliente = new Date();

  //   horaAtualAqui.horaPedidoCliente = new Date();
  //   const hora = horaAtualAqui.horaPedidoCliente.getHours();
  //   const minutos = horaAtualAqui.horaPedidoCliente.getMinutes();
  //   const dia = horaAtualAqui.horaPedidoCliente.getDate();
  //   const mes = horaAtualAqui.horaPedidoCliente.getMonth() + 1; // Os meses são indexados a partir de 0, então é necessário adicionar 1
  //   const ano = horaAtualAqui.horaPedidoCliente.getFullYear();

  //   const horaFormatada = `${this.formatarNumeroHora(dia)}/${this.formatarNumeroHora(mes)}/${ano} - ${this.formatarNumeroHora(hora)}:${this.formatarNumeroHora(minutos)}`;
  //   this.horaDoPedido = horaFormatada;
  //   console.log("Hora do pedido!!" + this.horaDoPedido);
  // }
}
