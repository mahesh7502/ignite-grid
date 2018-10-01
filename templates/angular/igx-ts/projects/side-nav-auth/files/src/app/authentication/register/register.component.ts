import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';

import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string;
  email: string;
  password: string;

  public registrationForm: FormGroup;

  @Output() viewChange: EventEmitter<any> = new EventEmitter();
  @Output() registered: EventEmitter<any> = new EventEmitter();

  constructor(private authentication: AuthenticationService,
    private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.nullValidator],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  tryRegister() {
    const response = this.authentication.register(this.registrationForm.value);
    if (response) {
      this.userService.setCurrentUser(response);
      this.router.navigate(['/profile']);
      this.registered.emit();
    }
  }

  showLoginForm() {
    this.viewChange.emit();
  }
}
