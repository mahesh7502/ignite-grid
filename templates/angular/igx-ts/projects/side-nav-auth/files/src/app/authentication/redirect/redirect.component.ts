import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { ExternalAuthProvider, ExternalAuthService } from '../services/igx-auth.service';
import { ExternalLogin } from '../interfaces/login.interface';

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
    private externalAuthService: ExternalAuthService) {
    this.provider = route.data['value'].provider as ExternalAuthProvider;
  }

  async ngOnInit() {
    const userInfo: ExternalLogin = await this.externalAuthService.getUserInfo(this.provider);
    const result = await this.authService.loginWith(userInfo);
    if (!result.error) {
        this.user.setCurrentUser(result.user);
        this.router.navigate(['/profile']);
    } else {
      alert(result.error);
    }
  }
}
