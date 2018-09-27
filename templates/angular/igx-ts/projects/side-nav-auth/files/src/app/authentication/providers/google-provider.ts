import { take } from 'rxjs/operators';
import {
    OidcConfigService,
    OidcSecurityService,
    AuthWellKnownEndpoints,
    OpenIDImplicitFlowConfiguration
} from 'angular-auth-oidc-client';
import { IAuthProvider } from './IAuthProvider';
import { IUser } from '../interfaces/user-model.interface';
import { ExternalAuthConfig } from '../services/igx-auth.service';

export class GoogleProvider implements IAuthProvider {
    constructor(protected oidcConfigService: OidcConfigService, protected oidcSecurityService: OidcSecurityService,
        protected externalStsConfig: ExternalAuthConfig) {
    }

    public config() {
        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer = this.externalStsConfig.stsServer;
        openIDImplicitFlowConfiguration.redirect_url = this.externalStsConfig.redirect_url;
        openIDImplicitFlowConfiguration.client_id = this.externalStsConfig.client_id;
        openIDImplicitFlowConfiguration.response_type = this.externalStsConfig.response_type;
        openIDImplicitFlowConfiguration.scope = this.externalStsConfig.scope;
        openIDImplicitFlowConfiguration.post_logout_redirect_uri = this.externalStsConfig.redirect_url;
        openIDImplicitFlowConfiguration.post_login_route = this.externalStsConfig.post_login_route;
        openIDImplicitFlowConfiguration.auto_userinfo = this.externalStsConfig.auto_userinfo;
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds =
            this.externalStsConfig.max_id_token_iat_offset_allowed_in_seconds;
        // TODO: always?
        openIDImplicitFlowConfiguration.silent_renew = false;

        const authWellKnownEndpoints = new AuthWellKnownEndpoints();
        authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);
        this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    }

    public login() {
        this.oidcConfigService.onConfigurationLoaded.pipe(take(1)).subscribe(() => {
            this.config();
            this.oidcSecurityService.authorize();
        });
        this.oidcConfigService.load_using_stsServer(this.externalStsConfig.stsServer);
    }

    public getUserInfo() {
        let resolve: (val: IUser) => void;
        let reject: () => void;
        const user = new Promise<IUser>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        this.oidcConfigService.onConfigurationLoaded.pipe(take(1)).subscribe(() => {
            this.config();
            this.oidcSecurityService.onAuthorizationResult.subscribe(() => {
                this.oidcSecurityService.getUserData().subscribe(userData => {
                    resolve(userData as IUser);
                });
            });
            this.oidcSecurityService.authorizedCallback();
        });
        this.oidcConfigService.load_using_stsServer(this.externalStsConfig.stsServer);
        return user;
    }

    public logout() {
        this.oidcSecurityService.logoff();
        // Should we expressly clear the Session storage?
        // window.sessionStorage.clear();
    }
}
