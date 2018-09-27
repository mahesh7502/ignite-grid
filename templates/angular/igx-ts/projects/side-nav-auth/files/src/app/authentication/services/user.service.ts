import { Injectable } from '@angular/core';

import { IUser } from '../interfaces/user-model.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  private _currentUser: IUser;
  public get currentUser(): IUser {
    if (!this._currentUser) {
      this._currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    return this._currentUser;
  }
  public set currentUser(v: IUser) {
    this._currentUser = v;
  }

  setCurrentUser(user: IUser) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = user;
  }

  logout() {
    this._currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
