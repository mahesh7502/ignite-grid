import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { IgxInputGroupModule, IgxButtonModule, IgxRippleModule, IgxIconModule } from 'igniteui-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ExternalAuthService, ExternalAuthProvider } from '../services/igx-auth.service';
import { AuthenticationService } from '../services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const extAuthSpy = jasmine.createSpyObj('ExternalAuthService', ['login', 'has']);
  const authSpy = jasmine.createSpyObj('AuthenticationService', ['login']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, RouterTestingModule, IgxInputGroupModule, IgxButtonModule, IgxIconModule, IgxRippleModule ],
      declarations: [ LoginComponent ],
      providers: [
        { provide: ExternalAuthService, useValue: extAuthSpy },
        { provide: AuthenticationService, useValue: authSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit login data', () => {
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['email'].setValue('test@example.com');
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['password'].setValue('123456');
    expect(component.loginForm.valid).toBeTruthy();
    component.tryLogin();
    expect(authSpy.login).toHaveBeenCalledTimes(1);
    expect(authSpy.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456'
    });
  });

  it('should enable external auth buttons when configured', () => {
    let activeProvider = ExternalAuthProvider.Facebook;
    const has = (provider: ExternalAuthProvider) => provider === activeProvider;
    (extAuthSpy.has as jasmine.Spy).and.callFake(has);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button.facebook'))).toEqual(jasmine.any(DebugElement));
    expect(fixture.debugElement.query(By.css('button.google'))).toBeNull();
    expect(fixture.debugElement.query(By.css('button.microsoft'))).toBeNull();
    activeProvider = ExternalAuthProvider.Google;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button.facebook'))).toBeNull();
    expect(fixture.debugElement.query(By.css('button.google'))).toEqual(jasmine.any(DebugElement));
    expect(fixture.debugElement.query(By.css('button.microsoft'))).toBeNull();
  });

  it('external auth buttons should call correct login', () => {
    (extAuthSpy.has as jasmine.Spy).and.returnValue(true);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button.facebook')).nativeElement.click();
    expect(extAuthSpy.login).toHaveBeenCalledWith(ExternalAuthProvider.Facebook);
    fixture.debugElement.query(By.css('button.google')).nativeElement.click();
    expect(extAuthSpy.login).toHaveBeenCalledWith(ExternalAuthProvider.Google);
    fixture.debugElement.query(By.css('button.microsoft')).nativeElement.click();
    expect(extAuthSpy.login).toHaveBeenCalledWith(ExternalAuthProvider.Microsoft);
  });

  it('should emit viewChange on "create account" click', () => {
    spyOn(fixture.componentInstance.viewChange, 'emit');
    fixture.debugElement.query(By.css('#register')).nativeElement.click();
    expect(fixture.componentInstance.viewChange.emit).toHaveBeenCalled();
  });
});
