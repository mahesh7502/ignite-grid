import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OnInit, OnDestroy, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { IUser } from '../interfaces/user-model.interface';
import { ILogin } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit, OnDestroy {
  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;

  constructor(private http: HttpClient, private oidcSecurityService: OidcSecurityService) {
    this.isAuthorized = false;
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized()
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy() {
    this.isAuthorizedSubscription.unsubscribe();
  }

  public async login(userData: ILogin): Promise<{user?, error?}> {
    let data;
    try {
      data = await this.http.post('/login', userData).toPromise();
    } catch (e) {
      return { error: e.error.message };
    }
    return { user: this.decodeJWT(data as string) };
  }

  public loginWith(userInfo: IUser) {
    return this.http.post('/extlogin', userInfo);
  }

  public register(userData: IUser) {
    let data;
    this.http
      .post('/register', userData)
      .subscribe(
        suc => {
          data = this.login(suc as IUser);
        },
        fail => {
          alert(fail.error.message);
        }
      );

    return data;
  }

  //#region JWT util
  protected decodeJWT(str: string) {
    const parts = str.split('.');
    if (parts.length < 2) {
      return null;
    }
    return {
      header: this.decodeBase64Url(parts[0]),
      payload: this.decodeBase64Url(parts[1]),
      signature: parts[2]
    };
  }

  protected decodeBase64Url(base64Url: string) {
    // convert Base64Url to Base64: https://tools.ietf.org/html/rfc4648#section-5
    let output = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - output.length % 4) % 4;
    if (padding === 3) {
      throw Error('Invalid base64 input');
    }
    output += new Array(1 + padding).join('=');
    return atob(output);
  }
  //#endregion JWT util
}
