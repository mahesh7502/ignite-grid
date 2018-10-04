import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';

import { UserService } from '../services/user.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { IgxDropDownComponent, ISelectionEventArgs } from 'igniteui-angular';

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.scss']
})
export class LoginBarComponent {

  @ViewChild(LoginDialogComponent) loginDialog: LoginDialogComponent;
  @ViewChild(IgxDropDownComponent) igxDropDown: IgxDropDownComponent;

  constructor(public userService: UserService, private router: Router) {
  }

  openDialog() {
    this.loginDialog.open();
  }

  handleLogout() {
    this.router.navigate(['/home']);
    this.userService.logout();
  }

  menuSelect(args: ISelectionEventArgs) {
    // TODO: Use item value
    switch (args.newSelection.index) {
      case 0:
        this.router.navigate(['/profile']);
        break;
      case 1:
        this.handleLogout();
        break;
    }
    this.igxDropDown.setSelectedItem(-1);
  }
}
