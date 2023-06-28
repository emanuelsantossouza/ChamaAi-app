import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  isUsuarioLogado: boolean = false;
  constructor(private router: Router) {
    this.isUsuarioLogado = Boolean(localStorage.getItem('isUsuarioLogadoMobile'));

    if (this.isUsuarioLogado === true) {
      router.navigateByUrl('tabs');
    } else {
      router.navigateByUrl('login');
    }

  }

}
