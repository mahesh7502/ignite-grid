import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { IUser } from '../interfaces/user-model.interface';
import { AuthenticationService } from '../services/authentication.service';
import { ExternalAuthProvider, ExternalAuthService } from '../services/igx-auth.service';

@Component({
  template: '<p>Signing in...</p>'
})
export class RedirectComponent implements OnInit {
  private provider: ExternalAuthProvider;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private user: UserService,
    private authService: AuthenticationService,
    private externalAuthService: ExternalAuthService,
    private oidcSecurityService: OidcSecurityService) {
    this.provider = route.data['value'].provider as ExternalAuthProvider;
  }

  async ngOnInit() {
    const userInfo: IUser = await this.externalAuthService.getUserInfo(this.provider);
    this.authService.loginWith(userInfo).subscribe(
      suc => {
        userInfo.externalToken = this.oidcSecurityService.getToken();
        this.user.setCurrentUser(userInfo);
        this.router.navigate(['/profile']);
      },
      fail => {
        alert(fail.error.message);
      }
    );
  }
}
