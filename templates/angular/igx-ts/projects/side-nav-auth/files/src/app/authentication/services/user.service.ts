import { Injectable } from '@angular/core';

import { User } from '../models/user';

const USER_TOKEN = 'currentUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  private _currentUser: User;
  /** Current logged in user, if any */
  public get currentUser(): User {
    if (!this._currentUser) {
      this._currentUser = JSON.parse(localStorage.getItem(USER_TOKEN));
    }

    return this._currentUser;
  }

  /** Initials of the current user, if any */
  public get initials(): string {
    if (!this.currentUser) {
      return null;
    }
    let initials = this.currentUser.given_name.substr(0, 1);
    if (this.currentUser.family_name) {
      initials += this.currentUser.family_name.substr(0, 1);
    }
    return initials;
  }

  /** Save new login as current user */
  public setCurrentUser(user: User) {
    localStorage.setItem(USER_TOKEN, JSON.stringify(user));
    this._currentUser = user;
  }

  /** Clear current user */
  public logout() {
    this._currentUser = null;
    localStorage.removeItem(USER_TOKEN);
  }
}
