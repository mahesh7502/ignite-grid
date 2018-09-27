export interface ILogin {
    email: string;
    password: string;

    tryLogin();
    showRegistrationForm(event);
}
