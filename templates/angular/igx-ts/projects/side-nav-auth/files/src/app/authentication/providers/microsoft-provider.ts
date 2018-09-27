import {
    OidcConfigService,
    OidcSecurityService,
    AuthWellKnownEndpoints,
    OpenIDImplicitFlowConfiguration
} from 'angular-auth-oidc-client';

import { GoogleProvider } from './google-provider';

export class MicrosoftProvider extends GoogleProvider {
    public static redurectURL = 'ms-discovery/keys';

    /** ADD endpoint specific tenant + ID, used when connecting users from work or school accounts.
     * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc#fetch-the-openid-connect-metadata-document
     */
    public tenant = 'consumers';
    public tenantID = '';

    public config() {
        if (this.tenant === 'common') {
          // Replace common discovery URL issuer with correct tenant ID for token validation:
          this.oidcConfigService.wellKnownEndpoints.issuer =
            this.oidcConfigService.wellKnownEndpoints.issuer.replace('{tenantid}', this.tenantID);
        }

        // Microsoft doesn't support CORS for keys discovery URIs, intended for backend
        // See https://stackoverflow.com/a/44688644
        // Example implementation:
        // tslint:disable-next-line:max-line-length
        // https://blogs.msdn.microsoft.com/mihansen/2018/07/12/net-core-angular-app-with-openid-connection-implicit-flow-authentication-angular-auth-oidc-client/
        // https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-protocols-oidc
        this.oidcConfigService.wellKnownEndpoints.jwks_uri = MicrosoftProvider.redurectURL;
        super.config();
    }
}
