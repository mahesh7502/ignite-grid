import { IgxDialogComponent } from 'igniteui-angular';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  title: string;
  @ViewChild(IgxDialogComponent) public loginDialog: IgxDialogComponent;

  ngOnInit() { }

  open() {
    this.loginDialog.open();
  }

  showLoginForm() {
    this.title = 'Login';
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');

    loginForm.hidden = false;
    registrationForm.hidden = true;
  }

  closeDialog() {
    this.loginDialog.close();
  }

  changeTitle() {
    this.title = this.title === 'Register' ? 'Login' : 'Register';
  }
}
