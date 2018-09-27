import { IUser } from '../interfaces/user-model.interface';

export interface IAuthProvider {
  config();
  login();
  getUserInfo(): Promise<IUser>;
  logout();
}
