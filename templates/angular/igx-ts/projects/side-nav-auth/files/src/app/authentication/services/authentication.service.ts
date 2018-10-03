import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User, LoginResult } from '../interfaces/user-model.interface';
import { Login, ExternalLogin } from '../interfaces/login.interface';
import { Register } from '../interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  public async login(userData: Login): Promise<LoginResult> {
    let data: string;
    try {
      data = <string> await this.http.post('/login', userData).toPromise();
    } catch (e) {
      return { error: e.error.message };
    }
    const user = this.parseUser(data);
    return { user };
  }

  public async loginWith(userInfo: ExternalLogin): Promise<LoginResult> {
    let data: string;
    try {
      data = <string> await this.http.post('/extlogin', userInfo).toPromise();
    } catch (e) {
      return { error: e.error.message };
    }
    const user = this.parseUser(data);
    return { user };
  }

  public async register(userData: Register): Promise<LoginResult> {
    let data: string;
    try {
      data = <string> await this.http.post('/register', userData).toPromise();
    } catch (e) {
      return { error: e.error.message };
    }
    const user = this.parseUser(data);
    return { user };
  }

  //#region JWT util
  protected parseUser(jwt: string): User {
    const token = this.decodeJWT(jwt);
    const user = JSON.parse(token.payload) as User;
    // store token:
    user.token = jwt;
    return user;
  }

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
