import { Router } from '@angular/router';

import { IAuthProvider } from './IAuthProvider';
import { IUser } from '../interfaces/user-model.interface';
import { ExternalAuthConfig } from '../services/igx-auth.service';

export class FacebookProvider implements IAuthProvider {
    private user: IUser;

    constructor(private externalStsConfig: ExternalAuthConfig, private router: Router) { }

    public config() {
        // Requiring HTTPS for Facebook Login
        // https://developers.facebook.com/blog/post/2018/06/08/enforce-https-facebook-login/
        FB.init({
            appId: this.externalStsConfig.client_id,
            xfbml: false,
            version: 'v3.1'
        });
    }

    public login() {
        this.config();
        const self = this;
        FB.login((response) => {
            if (response.authResponse) {
                FB.api(
                    '/me?fields=id,email,name,first_name,last_name,picture',
                    (newResponse) => {
                        this.user = newResponse;
                        self.router.navigate([this.externalStsConfig.redirect_url]);
                    });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, { scope: 'public_profile' });
    }

    public getUserInfo(): Promise<IUser> {
        return Promise.resolve(this.user);
    }

    public logout() { }
}
