import {RouterModule, Routes} from '@angular/router';
import {NgModule, ModuleWithProviders} from '@angular/core';

import { AuthGuard } from './services/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { RedirectComponent } from './redirect/redirect.component';
import { ExternalAuthProvider, ExternalAuthRedirectUrl } from './services/igx-auth.service';

const authRoutes: Routes = [
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: ExternalAuthRedirectUrl.Google, component: RedirectComponent, data: { provider: ExternalAuthProvider.Google } },
    { path: ExternalAuthRedirectUrl.Facebook, component: RedirectComponent, data: { provider: ExternalAuthProvider.Facebook } },
    { path: ExternalAuthRedirectUrl.Microsoft, component: RedirectComponent, data: { provider: ExternalAuthProvider.Microsoft } }
];

@NgModule({
    imports: [
      RouterModule.forChild(authRoutes)
    ],
    exports: [
      RouterModule
    ]
  })
export class AuthenticationRoutingModule {}
