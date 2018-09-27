import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService, OidcConfigService } from 'angular-auth-oidc-client';

import { IUser } from '../interfaces/user-model.interface';
import { IAuthProvider } from '../providers/IAuthProvider';
import { GoogleProvider } from '../providers/google-provider';
import { FacebookProvider } from '../providers/facebook-provider';
import { MicrosoftProvider } from '../providers/microsoft-provider';
import { Location } from '@angular/common';

export enum ExternalAuthProvider {
    Facebook = 'Facebook',
    Google = 'Google',
    Microsoft = 'Microsoft'
}

export enum ExternalAuthRedirectUrl {
  Facebook = 'redirect-facebook',
  Google = 'redirect-google',
  Microsoft = 'redirect-microsoft'
}

export interface ExternalAuthConfig {
    stsServer: string;
    client_id: string;
    scope: string;
    provider: ExternalAuthProvider;
    redirect_url: string;
    response_type: string;
    post_logout_redirect_uri: string;
    post_login_route: string;
    auto_userinfo: boolean;
    max_id_token_iat_offset_allowed_in_seconds: number;
}

@Injectable({
    providedIn: 'root'
})
export class ExternalAuthService {
    activeProvider: ExternalAuthProvider;
    protected providers: Map<ExternalAuthProvider, IAuthProvider> = new Map();

    constructor(
        private router: Router,
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService,
        private location: Location) {
    }

    public has(provider: ExternalAuthProvider) {
      return this.providers.has(provider);
    }

    public addGoogle(client_id: string) {
      const googleConfig: ExternalAuthConfig = {
        provider: ExternalAuthProvider.Google,
        stsServer: 'https://accounts.google.com',
        client_id: client_id,
        scope: 'openid email profile',
        redirect_url: this.getAbsoluteUrl(ExternalAuthRedirectUrl.Google),
        response_type: 'id_token token',
        post_logout_redirect_uri: '/',
        post_login_route: 'redirect',
        auto_userinfo: false,
        max_id_token_iat_offset_allowed_in_seconds: 30
      };
      this.providers.set(
        ExternalAuthProvider.Google,
        new GoogleProvider(this.oidcConfigService, this.oidcSecurityService, googleConfig)
      );
    }

    public addFacebook(client_id: string) {
      const fbConfig: ExternalAuthConfig = {
        client_id: client_id,
        redirect_url: ExternalAuthRedirectUrl.Facebook
      } as ExternalAuthConfig;

      this.providers.set(
        ExternalAuthProvider.Facebook,
        new FacebookProvider(fbConfig, this.router)
      );
    }

    public addMicrosoft(client_id: string) {
      const msConfig: ExternalAuthConfig = {
        provider: ExternalAuthProvider.Microsoft,
        stsServer: 'https://login.microsoftonline.com/consumers/v2.0/',
        client_id: client_id,
        scope: 'openid email profile',
        redirect_url: this.getAbsoluteUrl(ExternalAuthRedirectUrl.Microsoft),
        response_type: 'id_token token',
        post_logout_redirect_uri: '/',
        post_login_route: '',
        auto_userinfo: false,
        max_id_token_iat_offset_allowed_in_seconds: 1000
      };
      this.providers.set(
        ExternalAuthProvider.Microsoft,
        new MicrosoftProvider(this.oidcConfigService, this.oidcSecurityService, msConfig)
      );
    }

    public login(provider: ExternalAuthProvider) {
        const extProvider = this.providers.get(provider);
        if (extProvider) {
          extProvider.login();
        }
    }

    /**
     * TODO setActiveProvider
     */
    public setActiveProvider(provider: ExternalAuthProvider) {
      this.activeProvider = provider;
    }

    /** TODO, use setActiveProvider only? */
    public getUserInfo(provider: ExternalAuthProvider): Promise<IUser> {
        const extProvider = this.providers.get(provider);
        if (extProvider) {
          return extProvider.getUserInfo();
        }
        return Promise.reject(null); // TODO ?
    }

    /**
     * logout
     */
    public logout() {
      this.providers.get(this.activeProvider).logout();
    }

    /** Returns an absolute URL like <app root URL>/path */
    protected getAbsoluteUrl(path: string) {
      return window.location.origin	+ this.location.prepareExternalUrl(path);
    }
}
