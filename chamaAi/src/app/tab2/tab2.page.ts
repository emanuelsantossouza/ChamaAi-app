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
  }

  ngOnInit() { }


  async ionViewDidEnter() {
    await this.CreateMap();
    await this.buscarSede();

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

  buscarSede() {
    this.sedeDados.BuscarDadosSede().subscribe((dados) => {
      this.listaDadosSede = dados;
      console.log(this.listaDadosSede);
    });
  }

  async sedeEscolhida(id?: number) {
    await this.map?.destroy();
    await this.CreateMap();
    // this.horaClienteFezPedido();

    this.sedeDados.BuscarDadosPorId(id!).subscribe(async (dados) => {
      console.log(dados.localizacaoSede);
      this.sedeEscolhidaPeloUsuario = dados;

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
            lat: dados.localizacaoSede.latitude as number,
            lng: dados.localizacaoSede.longitude as number,
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
            latlng: `${this.sedeEscolhidaPeloUsuario.localizacaoSede.latitude},${this.sedeEscolhidaPeloUsuario.localizacaoSede.longitude}`,
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

  // Essa função criar um pedido e atribui todos os valores para ele
  async atribuindoValorParaPedido() {
    console.log('Atribuir Valor');
    this.horaClienteFezPedido();
    const cookieServidor = this.cookies.get("userId");
    const convertcookieStringToNumber = parseInt(cookieServidor);

    console.log(convertcookieStringToNumber);
    console.log(this.sedeEscolhidaPeloUsuario.id);


    this.pedidoParaAPI = {
      usuarioId: convertcookieStringToNumber,
      sedeId: this.sedeEscolhidaPeloUsuario.id,
      localizacaoClienteOrigem: { latitude: (await this.usuarioCordenadas).coords.latitude, longitude: (await this.usuarioCordenadas).coords.longitude },
      localizacaoClienteDestino: { latitude: this.dadosGeocodeApi.results[0].geometry.location.lat, longitude: this.dadosGeocodeApi.results[0].geometry.location.lng, },
      horaPedidoCliente: this.horaDoPedido
    }
    console.log(this.pedidoParaAPI);

    this.pedidoService.CreatePedidoUsuarioParaSede(this.pedidoParaAPI).subscribe((dados) => console.log(dados));
  }

  async atribuirValorPedidoEscolhaUsuario() {
    console.log('Atribuir Valor Pedido Escolhido pelo usuario');

    await this.pedidoService.PegarPedidoUsuarioPorId(this.pedidoId).subscribe(async (dados) => {
      this.horaClienteFezPedido();

      const cookieServidor = this.cookies.get("userId");
      const convertcookieStringToNumber = parseInt(cookieServidor);
      this.sedeEscolhidaId = this.convertSedeEscolhida;

      console.log("Dados do Medoto get por PedidoId")
      console.log(dados);

      this.pedidoParaAPI = {
        id: this.pedidoId,
        usuarioId: convertcookieStringToNumber,
        sedeId: this.sedeEscolhidaId,
        localizacaoClienteOrigem: { latitude: (await this.usuarioCordenadas).coords.latitude, longitude: (await this.usuarioCordenadas).coords.longitude },
        localizacaoClienteDestino: { latitude: this.dadosGeocodeApi.results[0].geometry.location.lat, longitude: this.dadosGeocodeApi.results[0].geometry.location.lng, },
        horaPedidoCliente: this.horaDoPedido,
        descricaoProduto: dados.descricaoProduto,
        formaDePagamento: dados.formaDePagamento,
        isFragil: dados.isFragil,
        qualServico: {
          corrida: dados.qualServico?.corrida!,
          entrega: dados.qualServico?.entrega!
        }
      }

      console.log("Como de envio para o put");
      console.log(this.pedidoParaAPI);

      console.log('Corpo para o put, Deve estar completo');
      console.log(this.pedidoParaAPI);
      this.pedidoService.AtualizarPedidoUsuarioParaSede(this.pedidoId, this.pedidoParaAPI!).subscribe((dados) => console.log(dados))
    })
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
