import { ExternalLogin } from '../models/login';

export interface IAuthProvider {
  config();
  login();
  getUserInfo(): Promise<ExternalLogin>;
  logout();
}
