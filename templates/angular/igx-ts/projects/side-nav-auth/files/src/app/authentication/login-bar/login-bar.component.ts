import { NavigationStart, Router } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { IgxDropDownComponent } from 'igniteui-angular';

import { UserService } from '../services/user.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.scss']
})
export class LoginBarComponent implements OnInit {

  @ViewChild(LoginDialogComponent) loginDialog: LoginDialogComponent;
  @ViewChild(IgxDropDownComponent) igxDropDown: IgxDropDownComponent;

  constructor(private router: Router, private userService: UserService) {
  }

  public ngOnInit(): void { }

  @HostListener('#loginButton click')
  openDialog() {
    this.loginDialog.open();
  }

  @HostListener('#logout click')
  handleLogout() {
    this.router.navigate(['/home']);
    this.userService.logout();
  }

  @HostListener('#profile click')
  openProfile() {
    this.router.navigate(['/profile']);
  }
}
