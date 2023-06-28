import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent {

  user: any
  loggedIn: any
  constructor(private authService: SocialAuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });


    // function handleCredentialResponse(response: { credential: string; }) {
    //   console.log("Encoded JWT ID token: " + response.credential);
    // }
    // window.onload = function () {
    //   google.accounts.id.initialize({
    //     client_id: "965114563182-eapdt0ov0smjb318hgmcar5ttfjv7a61.apps.googleusercontent.com",
    //     callback: handleCredentialResponse
    //   });
    //   google.accounts.id.renderButton(
    //     document.getElementById("buttonDiv"),
    //     { theme: "outline", size: "large" }  // customization attributes
    //   );
    //   google.accounts.id.prompt(); // also display the One Tap dialog
    // }
  }

   loginGoogle() {
     this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
   }
}
