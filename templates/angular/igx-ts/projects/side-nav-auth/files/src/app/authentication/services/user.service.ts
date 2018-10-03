import { Injectable } from '@angular/core';

import { User } from '../interfaces/user-model.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  private _currentUser: User;
  public get currentUser(): User {
    if (!this._currentUser) {
      this._currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    return this._currentUser;
  }
  public set currentUser(v: User) {
    this._currentUser = v;
  }

  setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = user;
  }

  logout() {
    this._currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
