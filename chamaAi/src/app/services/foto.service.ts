import { Injectable } from '@angular/core';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Foto } from '../interface/foto.interfaces';
import { UserService } from './cliente.service';
import { Usuario } from '../models/usuario';


@Injectable({
  providedIn: 'root',
})
export class FotoService {
  fotos: Foto[] = [];
  Usuario!: Usuario;
  private FOTO_ARMAZENAMENTO: string = 'fotos';

  constructor(private platform: Platform,
    private cliente: UserService) { }

  public async tirarFoto(usuario: any) {
    // Take a photo
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // dados baseados em arquivos; oferece o melhor desempenho
      source: CameraSource.Camera, // tirar automaticamente uma nova foto com a câmera
      quality: 50,// Trocar para 50 para não precisar fazer compactação da imagem
    });

    const salvarArquivoFoto = await this.salvarFoto(fotoCapturada, usuario);

    // Adicionar nova foto à matriz Fotos
    this.fotos.unshift(salvarArquivoFoto); // unshift faz ser o primeiro

    // Armazenar em cache todos os dados da foto para recuperação futura
    Preferences.set({
      key: this.FOTO_ARMAZENAMENTO,
      value: JSON.stringify(this.fotos),
    });
  }


  public async carregarFotosSalvas() {
    // Recuperar as fotos em cache
    const listaFotos = await Preferences.get({ key: this.FOTO_ARMAZENAMENTO });
    this.fotos = JSON.parse(listaFotos.value as string) || [];

    // Se estiver rodando no navegador...
    if (!this.platform.is('hybrid')) {
      // Exibir a foto lendo-a no formato base64
      for (let foto of this.fotos) {
        // Ler os dados de cada foto salva no sistema de arquivos
        const readFile = await Filesystem.readFile({
          path: foto.filepath,
          directory: Directory.Data,
        });

        // Somente na plataforma da Web: Carregar a foto como dados base64
        foto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }



  // Salvar imagem em um arquivo no dispositivo no PC
  private async salvarFoto(foto: Photo, usuario: Usuario) {
    // Converta a foto para o formato base64, exigido pela API do sistema de arquivos para salvar
    const base64Data = await this.readAsBase64(foto);

    // Enviar para o servidor
    usuario = {
      id: usuario.id,
      nomeCompleto: usuario.nomeCompleto,
      telefone: usuario.telefone,
      email: usuario.email,
      dataDNascimento: usuario.dataDNascimento,
      fotoDePerfil: base64Data,
      senha: usuario.senha,
      confirmaSenha: usuario.confirmaSenha,
    }
    this.cliente.alteraFoto(usuario.id!, usuario).subscribe((dados) => console.log(dados));

    // Gravar o arquivo no diretório de dados
    const nomeArquivo = new Date().getTime() + '.jpeg';
    const arquivoSalvo = await Filesystem.writeFile({
      path: nomeArquivo,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      // Exiba a nova imagem reescrevendo o caminho 'file://' para HTTP
      // Detalhes: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: arquivoSalvo.uri,
        webviewPath: Capacitor.convertFileSrc(arquivoSalvo.uri),
      };
    } else {
      // Use o webPath para exibir a nova imagem em vez da base64, pois ela já está carregada na memória
      return {
        filepath: nomeArquivo,
        webviewPath: foto.webPath,
      };
    }
  }

  // Leia a foto da câmera no formato base64 com base na plataforma em que o aplicativo está sendo executado
  private async readAsBase64(foto: Photo) {
    // "híbrido" detectará Cordova ou Capacitor
    if (this.platform.is('hybrid')) {
      // Ler o arquivo no formato base64
      const arquivo = await Filesystem.readFile({
        path: foto.path as string,
      });

      return arquivo.data;
    } else {
      // Obtenha a foto, leia-a como um blob e, em seguida, converta-a para o formato base64
      const resposta = await fetch(foto.webPath!);
      const blob = await resposta.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  // Excluir a imagem, removendo-a dos dados de referência e do sistema de arquivos
  public async deletePicture(foto: Foto, posicao: number) {
    // Remover essa foto da matriz de dados de referência Fotos
    this.fotos.splice(posicao, 1);

    // Atualizar o cache da matriz de fotos sobrescrevendo a matriz de fotos existente
    Preferences.set({
      key: this.FOTO_ARMAZENAMENTO,
      value: JSON.stringify(this.fotos),
    });

    // excluir o arquivo de foto do sistema de arquivos
    const nomeArquivo = foto.filepath?.substr(foto.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: nomeArquivo,
      directory: Directory.Data,
    });
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

}