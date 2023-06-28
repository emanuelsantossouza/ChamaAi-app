import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-facebook',
  templateUrl: './login-facebook.component.html',
  styleUrls: ['./login-facebook.component.scss'],
})
export class LoginFacebookComponenet {

  user: any
  loggedIn: any
  constructor(private authService: SocialAuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  LoginFacebook() {
    console.log(this.authService.signIn(FacebookLoginProvider.PROVIDER_ID))
  }
}
