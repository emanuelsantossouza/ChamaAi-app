export class LatLng {
  latitude?: number;
  longitude?: number;
}

export class EscolhaPedido {
  corrida!: boolean;
  entrega!: boolean;
}

export class Pedido {
  id?: number;
  usuarioId?: number;
  sedeId?: number;
  horaPedidoCliente?: string;
  localizacaoClienteOrigem: LatLng = {
    latitude: 0,
    longitude: 0
  };
  localizacaoClienteDestino: LatLng = {
    latitude: 0,
    longitude: 0
  }
  pesoProduto?: number;
  tamanhoProduto?: string;
  isFragil?: boolean;
  descricaoProduto?: string
  formaDePagamento?: string;
  qualServico?: EscolhaPedido = {
    corrida: false,
    entrega: false
  }
}



