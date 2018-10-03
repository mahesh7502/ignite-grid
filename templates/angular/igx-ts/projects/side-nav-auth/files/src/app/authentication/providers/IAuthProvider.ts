import { ExternalLogin } from '../interfaces/login.interface';

export interface IAuthProvider {
  config();
  login();
  getUserInfo(): Promise<ExternalLogin>;
  logout();
}
