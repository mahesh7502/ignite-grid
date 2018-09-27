import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, dematerialize } from 'rxjs/operators';
import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpInterceptor,
    HTTP_INTERCEPTORS
} from '@angular/common/http';

import msKeys from './microsoft-keys';
import { IUser } from '../interfaces/user-model.interface';

@Injectable({
    providedIn: 'root'
})
export class BackendInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: IUser[] = JSON.parse(localStorage.getItem('users')) || [];
        return of(null).pipe(mergeMap(() => {
            // login user
            if (request.url.endsWith('/login') && request.method === 'POST') {
                return this.loginHandle(request, users);
            }

            // register user
            if (request.url.endsWith('/register') && request.method === 'POST') {
                return this.registerHandle(request, users);
            }

            // login user with external provider
            if (request.url.endsWith('/extlogin') && request.method === 'POST') {
                return this.loginExt(request, users);
            }

            // Microsoft-specific OIDC discovery URI
            if (request.url.endsWith('ms-discovery/keys') && request.method === 'GET') {
                return of(new HttpResponse({ status: 200, body: msKeys }));
            }

            return next.handle(request);
        }))
            .pipe(materialize())
            .pipe(dematerialize());
    }

    loginExt(request: HttpRequest<any>, users: IUser[]) {
        this.registerHandle(request, users);
        const userData = this.loginHandle(request, users);

        return of(new HttpResponse({ status: 200, body: userData }));
    }

    registerHandle(request: HttpRequest<any>, users: IUser[]) {
        const newUser = request.body as IUser;
        newUser.token = this.generateToken();
        const duplicateUser = users.filter(user => user.email === newUser.email).length;
        if (duplicateUser) {
            return throwError({ error: { message: 'Account with email "' + newUser.email + '" already exists' } });
        }

        // if the user is from an external provider use their id, otherwise generate new one
        newUser.id = newUser.id ? newUser.id : users.length + 1;
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        return of(new HttpResponse({ status: 200, body: newUser }));
    }

    loginHandle(request: HttpRequest<any>, users: IUser[]) {
        const filteredUsers = users.filter(user => {
            return user.email === request.body.email;
        });
        // authenticate
        if (filteredUsers.length) {
            const user: IUser = filteredUsers[0];
            const body: IUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                token: user.token,
                picture: user.picture
            };

            return of(new HttpResponse({ status: 200, body: body }));
        } else {
            return throwError({ error: { message: 'User does not exist!' } });
        }
    }

    private generateToken(): string {
        return Math.random().toString(36).substring(6);
    }
}

export const BackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: BackendInterceptor,
    multi: true
};
