import { IgxDialogComponent } from 'igniteui-angular';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  public showLogin = true;
  public get title() { return this.showLogin ? 'Login' : 'Register'; }
  @ViewChild(IgxDialogComponent) public loginDialog: IgxDialogComponent;

  open() {
    this.loginDialog.open();
  }

  showLoginForm () {
    this.showLogin = true;
  }

  closeDialog() {
    this.loginDialog.close();
  }

  toggleView() {
    this.showLogin = !this.showLogin;
  }
}
