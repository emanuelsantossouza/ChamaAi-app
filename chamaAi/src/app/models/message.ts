export class mensagens {
  user?: string;
  msg?: string;
  data?: string;
}

export class Mensagem{
  user: any;
  message: any;
  date: any
}

export class MensagemParaApi{
  mensagens: mensagens = {
    data: '',
    msg: '',
    user: ''
  }
  clienteId?: number
  SedeId?: number
}


