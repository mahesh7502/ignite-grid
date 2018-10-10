import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User, LoginResult } from '../models/user';
import { Login, ExternalLogin } from '../models/login';
import { Register } from '../models/register';
import { parseUser } from './jwt-util';

/** Authentication API Service */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  /** Send basic credentials to login endpoint. */
  public async login(userData: Login): Promise<LoginResult> {
    let data: string;
    try {
      data = <string> await this.http.post('/login', userData).toPromise();
    } catch (e) {
      return { error: e.error.message };
    }
    const user: User = parseUser(data);
    return { user };
  }

  /** Send user info from 3rd party provider to external login endpoint. */
  public async loginWith(userInfo: ExternalLogin): Promise<LoginResult> {
    let data: string;
    try {
      data = <string> await this.http.post('/extlogin', userInfo).toPromise();
    } catch (e) {
      return { error: e.error.message };
    }
    const user: User = parseUser(data);
    return { user };
  }

  /** Send user info to register endpoint. */
  public async register(userData: Register): Promise<LoginResult> {
    let data: string;
    try {
      data = <string> await this.http.post('/register', userData).toPromise();
    } catch (e) {
      return { error: e.error.message };
    }
    const user: User = parseUser(data);
    return { user };
  }
}
