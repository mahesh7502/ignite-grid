import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User, LoginResult } from '../interfaces/user-model.interface';
import { Login, ExternalLogin } from '../interfaces/login.interface';
import { Register } from '../interfaces/register.interface';
import { parseUser } from './jwt-util';

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
    const user: User = parseUser(data);
    return { user };
  }

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
