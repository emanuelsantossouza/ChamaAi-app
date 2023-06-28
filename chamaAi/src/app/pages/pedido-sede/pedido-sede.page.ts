import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SedeService } from 'src/app/services/sede.service';
import { UserService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-pedido-sede',
  templateUrl: './pedido-sede.page.html',
  styleUrls: ['./pedido-sede.page.scss'],
})
export class PedidoSedePage implements OnInit {

  constructor(
    private userService: UserService,
    private cookies: CookieService
  ) { }



  ngOnInit() {}




}
