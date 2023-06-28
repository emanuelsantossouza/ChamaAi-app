export class LatLng {
  latitude?: number ;
  longitude?: number;
}

export class Sede {
  id?: number;
  nome?: string | undefined;
  email?: string | undefined;
  telefone?: string | undefined;
  estado?: string | undefined;
  cidade?: string | undefined;
  endereco?: string | undefined;
  enderecoNumero?: number | undefined;
  cep?: string | undefined;
  logo?: string | undefined;
  sobreNos?: string | undefined;
  cnpj?: string | undefined;
  localizacaoSede?: LatLng = {
    latitude: 0,
    longitude: 0
  };
}


