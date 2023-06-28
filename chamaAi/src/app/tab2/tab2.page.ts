import { Pedido } from './../models/pedido';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { listaEnderecos } from '../models/requisicaoGoogleMaps';
import { CameraConfig, LatLng, Marker, Polyline } from '@capacitor/google-maps/dist/typings/definitions';
import { SedeService } from '../services/sede.service';
import { Sede } from '../models/Sede';
import { PedidoService } from '../services/pedido.service';
import { CookieService } from 'ngx-cookie-service';
import { Motoboy } from '../models/motoboy';

declare var google: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild('map', { static: false }) mapRef?: ElementRef;
  @ViewChild('tamanhoMap', { static: true }) tamanhoMapRef!: ElementRef;

  map?: GoogleMap;
  loading?: HTMLIonLoadingElement;
  serch: string = '';

  polyLineId: string = '';
  markerId: string = '';

  origemMarker!: any;
  destination: boolean = false;
  markerDestinion: any;
  dadosGeocodeApi: any;
  idMarke: any
  localizacaoMarkeDestino: any


  listaEnderecos: listaEnderecos[] = []
  listaDadosSede: Sede[] = []
  listaDadosMotoboy: Motoboy[] = []
  sedeEscolhidaPeloUsuario!: Sede;
  pedidoParaAPI?: Pedido;

  googleAutoComplet = new google.maps.places.AutocompleteService();
  googleDeriction = new google.maps.DirectionsService();
  usuarioCordenadas = Geolocation.getCurrentPosition();
  autocomplete: any;

  dadosGeoCodeApiSede: any

  tamanhoMapHeight: string = '100%';
  horaDoPedido: any;

  pedirPeloTabsCorrida!: boolean;
  pedirPeloTabsEntrega!: boolean;

  sedeEscolhidaId!: number;
  convertSedeEscolhida: number;

  pedidoId!: number;

  constructor(
    private loadCrtl: LoadingController,
    private http: HttpClient,
    private sedeDados: SedeService,
    private AlertCrtl: AlertController,
    private pedidoService: PedidoService,
    private cookies: CookieService,
    private toastCrtl: ToastController
  ) {
    this.horaClienteFezPedido();

    this.convertSedeEscolhida = parseInt(localStorage.getItem('SedeEscolhidaId')!);
    this.pedirPeloTabsCorrida = Boolean(localStorage.getItem('PedirPeloTabsCorrida')!);
    this.pedirPeloTabsEntrega = Boolean(localStorage.getItem('PedirPeloTabsEntrega')!);


    this.listaDadosMotoboy = [
      {
        id: 1,
        nomeCompleto: 'Paulo Santos',
        fotoDePerfil: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/usuario/Kaike.jpeg',
      },
      {
        id: 2,
        nomeCompleto: 'Maria ',
        fotoDePerfil: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/usuario/AnaMelo.webp',
      },
      {
        id: 3,
        nomeCompleto: 'Kauan',
        fotoDePerfil: 'https://i.pinimg.com/236x/1b/5e/f4/1b5ef428f7403ec9d5a5818de6363ebc.jpg',
      },
      {
        id: 4,
        nomeCompleto: 'Ana Jesus',
        fotoDePerfil: 'https://img.freepik.com/fotos-gratis/mulher-moderna-tomando-uma-selfie_23-2147893976.jpg',
      },
      {
        id: 5,
        nomeCompleto: 'Pedro',
        fotoDePerfil: 'https://1.bp.blogspot.com/-kM7M9iZhySo/XsHb0_oyUbI/AAAAAAAAVio/om5N7tCgRnUq9Ns2ELsyy6GBC53ByGSOACNcBGAsYHQ/s1600/selfie%2Bde%2Bhomem%2Bde%2Bbarba%2B11.jpg',
      },
      {
        id: 6,
        nomeCompleto: 'Fernanda',
        fotoDePerfil: 'data:image/jpeg;base64,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',
      },
      {
        id: 7,
        nomeCompleto: 'Emanuel',
        fotoDePerfil: 'https://img.freepik.com/fotos-premium/perfil-do-retrato-de-jovem-serio-uma-imagem-de-um-homem-bonito-com-barba_116317-13982.jpg?w=2000',
      }
    ];



    this.listaDadosSede = [
      {
        id: 1,
        logo: 'https://img.elo7.com.br/product/main/4418282/logomarca-tema-motoboy-arte.jpg',
        endereco: 'R. Maj. Pompeu - Centro',
        nome: 'Motokas Center',
        localizacaoSede: {
          latitude: -22.497647,
          longitude: -48.557697,
        },
      },
      {
        id: 2,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/Chamou.Chegou%20Motos.png',
        endereco: 'R.Salvador de Toledo - Centro',
        nome: 'Chegou Motos',
        localizacaoSede: {
          latitude: -22.496132,
          longitude: - 48.559654,
        },
      },
      {
        id: 3,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/motosExpress%20(1).png',
        endereco: '261 R. Ângelo Reginato',
        nome: 'Motos Express',
        localizacaoSede: {
          latitude: 22.490615,
          longitude: - 48.563118,
        },
      },
      {
        id: 4,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/VelozMotos.png',
        endereco: 'R. Antônio Destro - Sonho nosso',
        nome: 'Veloz Motos',
        localizacaoSede: {
          latitude: -22.467396,
          longitude: - 48.561526,
        },
      },
      {
        id: 5,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/MotoLigeiro.png',
        endereco: 'R.Francisco Martins - Sonho nosso 5',
        nome: 'Motos Ligueirinho',
        localizacaoSede: {
          latitude: -22.460819,
          longitude: - 48.566459,
        },
      },
      {
        id: 6,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/MotoFacil.png',
        endereco: 'R.Joaquim Angelo Momesso - Vila Hab',
        nome: 'Moto Facil',
        localizacaoSede: {
          latitude: -22.491509,
          longitude: -48.546242,
        },
      },
      {
        id: 7,
        logo: 'https://img.elo7.com.br/product/360x360/4418247/logomarca-tema-motoboy-arte.jpg',
        endereco: 'R.Augusto da Silva - Nova Barra',
        nome: 'Motos Flash',
        localizacaoSede: {
          latitude: -22.484631,
          longitude: - 48.573221,
        },
      },
      {
        id: 8,
        logo: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/main/logos/MotoAs.png',
        endereco: 'R.Hilário Parezan - CECAP',
        nome: 'Motos Agies',
        localizacaoSede: {
          latitude: -22.483528,
          longitude: -48.563805,
        },
      },
    ]
  }

  ngOnInit() { }


  async ionViewDidEnter() {
    await this.CreateMap();
    // await this.buscarSede();

    console.log("Aquii seu id")
    console.log(this.pedidoId);
    this.pedidoId = parseInt(localStorage.getItem('PedidoId')!);
  }

  ionViewDidLeave() {
    console.log('removendo chaves')
    localStorage.removeItem('SedeEscolhidaId');
    localStorage.removeItem('motoboyEscolhidoId');
  }

  async CreateMap() {
    this.loading = await this.loadCrtl.create({ message: 'Por favor, aguarde...' });
    await this.loading.present();

    try {
      this.map = await GoogleMap.create({
        apiKey: environment.mapsKey,
        element: this.mapRef?.nativeElement,
        id: 'Map-Cordova',
        config: {
          center: {
            lat: (await this.usuarioCordenadas).coords.latitude,
            lng: (await this.usuarioCordenadas).coords.longitude,
          },
          zoom: 12,
          disableDefaultUI: true,
          disableDoubleClickZoom: true,
          backgroundColor: 'white',
        },
      });
    } catch (erro) {
      console.log(erro);
    } finally {
      this.loading.dismiss();
    }
  }

  buscarEndereco(buscaCampo: any) {
    const busca = buscaCampo.target.value as string;

    if (!busca.trim().length) {
      this.listaEnderecos = [];
    }

    this.googleAutoComplet.getPlacePredictions({ input: busca }, (respotaServidor: any) => {
      this.listaEnderecos = respotaServidor;
      console.log(respotaServidor);
    });
  }

  async addOringMarker() {
    this.origemMarker = this.map?.addMarker({
      title: 'Sua localização',
      snippet: 'Descrição',
      coordinate: {
        lat: (await this.usuarioCordenadas).coords.latitude,
        lng: (await this.usuarioCordenadas).coords.longitude,
      },
      iconUrl:
        'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/3e20e9a9a669f6e7a963cd73cbe2a088c940ca24/icons/IconLocaliza%C3%A7%C3%A3oAtualCliente.svg',
      iconAnchor: { x: 20, y: 33 },
    });

    this.map?.setOnInfoWindowClickListener((event) => {
      console.log(event.snippet);
    });

    let is: boolean = false;
    this.map?.enableAccessibilityElements((is = true));
  }

  async calcuRota(item: any) {
    this.addOringMarker();
    this.destination = true;
    console.log(item);

    this.http
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          key: environment.mapsKey,
          place_id: item.place_id,
        },
      })
      .subscribe(async (dadosLocais) => {
        this.dadosGeocodeApi = dadosLocais;
        console.log(dadosLocais);
        console.log(this.dadosGeocodeApi.results[0]);

        this.localizacaoMarkeDestino = this.dadosGeocodeApi.results[0].geometry

        this.markerDestinion = this.map?.addMarker({
          coordinate: {
            lat: this.dadosGeocodeApi.results[0].geometry.location.lat,
            lng: this.dadosGeocodeApi.results[0].geometry.location.lng,
          },
          title: this.dadosGeocodeApi.results[0].formatted_address,
          iconUrl: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/f42bdf4c08684af1db13aca13d32d710054d0216/icons/iconPontoDestinoUsuario.svg',
          iconSize: {
            height: 40,
            width: 40,
          },
          iconAnchor: { x: 18, y: 40 },
        });

        console.log(this.dadosGeocodeApi.results[0].geometry.location);
        const destinationLatLng = new google.maps.LatLng(
          this.dadosGeocodeApi.results[0].geometry.location.lat,
          this.dadosGeocodeApi.results[0].geometry.location.lng
        );

        const oringLatLng = new google.maps.LatLng(
          (await this.usuarioCordenadas).coords.latitude,
          (await this.usuarioCordenadas).coords.longitude
        );

        this.googleDeriction.route(
          {
            origin: oringLatLng,
            destination: destinationLatLng,
            travelMode: 'DRIVING',
          },
          async (results: any, status: any) => {
            if (status === 'OK') {
              const points: LatLng[] = [];

              const routes = results.routes[0].overview_path;

              for (let i = 0; i < routes.length; i++) {
                points.push({
                  lat: routes[i].lat(),
                  lng: routes[i].lng(),
                });
              }

              const lines: Polyline[] = [
                {
                  path: points,
                  strokeColor: '#0F7ED5',
                  strokeWeight: 3,
                  geodesic: true,
                  visible: true,
                  clickable: true,
                  strokeOpacity: 0.7,
                },
              ];
              this.map?.addPolylines(lines);
              const cameraConfig: CameraConfig = {
                coordinate: {
                  lat: points[0].lat,
                  lng: points[0].lng,
                },
                zoom: 13,
              };
              this.map?.setCamera(cameraConfig);
            }
            this.tamanhoMapHeight = '90%';
          }
        );
      });
  }

  async back() {
    await this.map?.destroy();
    this.CreateMap();
    this.destination = false;
    this.listaEnderecos = [];
    this.tamanhoMapHeight = '100%';
  }

  // buscarSede() {
  //   this.sedeDados.BuscarDadosSede().subscribe((dados) => {
  //     this.listaDadosSede = dados;
  //     console.log(this.listaDadosSede);
  //   });
  // }

  async sedeEscolhida(id?: number) {
    await this.map?.destroy();
    await this.CreateMap();
    // this.horaClienteFezPedido();



    this.sedeEscolhidaPeloUsuario = this.listaDadosSede[id!];

    console.log(this.sedeEscolhidaPeloUsuario);
    this.map?.addMarkers([
      {
        coordinate: {
          lat: (await this.usuarioCordenadas).coords.latitude,
          lng: (await this.usuarioCordenadas).coords.longitude,
        },
        title: 'Sua localização',
        iconUrl: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/3e20e9a9a669f6e7a963cd73cbe2a088c940ca24/icons/IconLocaliza%C3%A7%C3%A3oAtualCliente.svg',
        iconAnchor: { x: 20, y: 33 },
      },
      {
        title: 'Localização Sede até você',
        coordinate: {
          lat: this.sedeEscolhidaPeloUsuario.localizacaoSede?.latitude!,
          lng: this.sedeEscolhidaPeloUsuario.localizacaoSede?.longitude!
        },
        iconUrl: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/f42bdf4c08684af1db13aca13d32d710054d0216/icons/iconMapsSede.svg',
        iconAnchor: { x: 20, y: 33, }
      },
      {
        coordinate: {
          lat: this.localizacaoMarkeDestino.location.lat,
          lng: this.localizacaoMarkeDestino.location.lng
        },
        iconUrl: 'https://raw.githubusercontent.com/emanuelsantossouza/tccImg/f42bdf4c08684af1db13aca13d32d710054d0216/icons/iconPontoDestinoUsuario.svg',
        iconSize: {
          height: 40,
          width: 40,
        },
        iconAnchor: { x: 18, y: 40 },
      }
    ]);

    console.log(this.localizacaoMarkeDestino)
    console.log(this.sedeEscolhidaPeloUsuario);

    this.http
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          key: environment.mapsKey,
          latlng: `${this.sedeEscolhidaPeloUsuario.localizacaoSede?.latitude},${this.sedeEscolhidaPeloUsuario.localizacaoSede?.longitude}`,
        },
      })
      .subscribe(async (dados) => {
        console.log(dados);
        this.dadosGeoCodeApiSede = dados;

        console.log(this.dadosGeoCodeApiSede.results[0].geometry.location);

        const SedeConversaoParaGoogleMapsLatLng = new google.maps.LatLng(
          this.dadosGeoCodeApiSede.results[0].geometry.location.lat,
          this.dadosGeoCodeApiSede.results[0].geometry.location.lng
        );

        const oringLatLng = new google.maps.LatLng(
          (await this.usuarioCordenadas).coords.latitude,
          (await this.usuarioCordenadas).coords.longitude
        );


        this.googleDeriction.route(
          {
            origin: oringLatLng,
            destination: SedeConversaoParaGoogleMapsLatLng,
            travelMode: 'DRIVING',
          },
          async (results: any, status: any) => {
            if (status === 'OK') {
              const points: LatLng[] = [];

              const routes = results.routes[0].overview_path;

              for (let i = 0; i < routes.length; i++) {
                points.push({
                  lat: routes[i].lat(),
                  lng: routes[i].lng(),
                });
              }

              const lines: Polyline[] = [
                {
                  path: points,
                  strokeColor: '#EDCF00',
                  strokeWeight: 3,
                  geodesic: true,
                  visible: true,
                  clickable: true,
                },
              ];
              this.map?.addPolylines(lines);

              console.log(points);

              const cameraConfig: CameraConfig = {
                coordinate: {
                  lat: points[0].lat,
                  lng: points[0].lng,
                },
                zoom: 14,
              };
              this.map?.setCamera(cameraConfig);
              this.tamanhoMapHeight = '60%';
            }
          }
        );
      });

  }

  async confirmacaoDaSedeEscolhidaPeloUsuario() {
    const alert = await this.AlertCrtl.create({
      header: 'Confirme a sua viajem!!',
      message: 'Por favor, faça a confirmação do seu pedido!!!',
      buttons: [{
        text: 'Pedir!',
        handler: () => {
          this.enviadoPedido();
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
      ],
    },
    );

    await alert.present();
  }

  // Essa função criar um pedido e atribui todos os valores para ele - // Salvar no servidor
  async atribuindoValorParaPedido() {
    console.log('Atribuir Valor');
    this.horaClienteFezPedido();
    const cookieServidor = this.cookies.get("userId");
    const convertcookieStringToNumber = parseInt(cookieServidor);

    console.log(convertcookieStringToNumber);
    console.log(this.sedeEscolhidaPeloUsuario.id);


    // this.pedidoParaAPI = {
    //   usuarioId: convertcookieStringToNumber,
    //   sedeId: this.sedeEscolhidaPeloUsuario.id,
    //   localizacaoClienteOrigem: { latitude: (await this.usuarioCordenadas).coords.latitude, longitude: (await this.usuarioCordenadas).coords.longitude },
    //   localizacaoClienteDestino: { latitude: this.dadosGeocodeApi.results[0].geometry.location.lat, longitude: this.dadosGeocodeApi.results[0].geometry.location.lng, },
    //   horaPedidoCliente: this.horaDoPedido
    // }
    // console.log(this.pedidoParaAPI);

    // this.pedidoService.CreatePedidoUsuarioParaSede(this.pedidoParaAPI).subscribe((dados) => console.log(dados));
  }

  // Salvar no servidor
  async atribuirValorPedidoEscolhaUsuario() {
    console.log('Atribuir Valor Pedido Escolhido pelo usuario');

    // await this.pedidoService.PegarPedidoUsuarioPorId(this.pedidoId).subscribe(async (dados) => {
    //   this.horaClienteFezPedido();

    //   const cookieServidor = this.cookies.get("userId");
    //   const convertcookieStringToNumber = parseInt(cookieServidor);
    //   this.sedeEscolhidaId = this.convertSedeEscolhida;

    //   console.log("Dados do Medoto get por PedidoId")
    //   console.log(dados);

    //   this.pedidoParaAPI = {
    //     id: this.pedidoId,
    //     usuarioId: convertcookieStringToNumber,
    //     sedeId: this.sedeEscolhidaId,
    //     localizacaoClienteOrigem: { latitude: (await this.usuarioCordenadas).coords.latitude, longitude: (await this.usuarioCordenadas).coords.longitude },
    //     localizacaoClienteDestino: { latitude: this.dadosGeocodeApi.results[0].geometry.location.lat, longitude: this.dadosGeocodeApi.results[0].geometry.location.lng, },
    //     horaPedidoCliente: this.horaDoPedido,
    //     descricaoProduto: dados.descricaoProduto,
    //     formaDePagamento: dados.formaDePagamento,
    //     isFragil: dados.isFragil,
    //     qualServico: {
    //       corrida: dados.qualServico?.corrida!,
    //       entrega: dados.qualServico?.entrega!
    //     }
    //   }

    //   console.log("Como de envio para o put");
    //   console.log(this.pedidoParaAPI);

    //   console.log('Corpo para o put, Deve estar completo');
    //   console.log(this.pedidoParaAPI);
    //   this.pedidoService.AtualizarPedidoUsuarioParaSede(this.pedidoId, this.pedidoParaAPI!).subscribe((dados) => console.log(dados))
    // })
  }

  //Essa função envia o pedido para o Pedido.Services
  async enviadoPedido() {
    console.log('Enviar Pedido');
    console.log(this.pedidoId)

    // Testando se é um pedido per escolha de sede ou se é um pedido direto no maps
    if (this.pedirPeloTabsEntrega == true || this.pedirPeloTabsCorrida == true) {
      await this.atribuirValorPedidoEscolhaUsuario();
      const msg = 'Pedido realizado com sucesso, Aguarde no local informado de 10 a 15 minutos'
      localStorage.removeItem('PedirPeloTabsCorrida');
      localStorage.removeItem('PedirPeloTabsEntrega');
      return this.confirmacaoParaClienteToast(msg);
    } else {
      await this.atribuindoValorParaPedido();
      console.log(this.pedidoParaAPI);
      const msg = 'Pedido realizado com sucesso, Aguarde no local informado de 10 a 15 minutos';
      localStorage.removeItem('PedirPeloTabsCorrida');
      localStorage.removeItem('PedirPeloTabsEntrega');
      return this.confirmacaoParaClienteToast(msg);
    }
  }

  // // Essa função adiciona um 0 caso a hora ou o dia atual fore menores que 0
  formatarNumeroHora(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  // Essa função ele converte o tipo date para o formato de horas do padrão brasileito dd/MM/yy - hh:mm
  horaClienteFezPedido() {
    const horaAtualAqui = new Date();

    const hora = horaAtualAqui.getHours();
    const minutos = horaAtualAqui.getMinutes();
    const dia = horaAtualAqui.getDate();
    const mes = horaAtualAqui.getMonth() + 1; // Os meses são indexados a partir de 0, então é necessário adicionar 1
    const ano = horaAtualAqui.getFullYear();

    const horaFormatada = `${this.formatarNumeroHora(dia)}/${this.formatarNumeroHora(mes)}/${ano} - ${this.formatarNumeroHora(hora)}:${this.formatarNumeroHora(minutos)}`;
    this.horaDoPedido = horaFormatada;

    console.log("Hora do pedido!!" + this.horaDoPedido);
  }

  async confirmacaoParaClienteToast(msg: string) {
    const chamaToast = await this.toastCrtl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    chamaToast.present();
  }
}
