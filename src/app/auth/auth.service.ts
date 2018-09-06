import { Injectable } from "@angular/core";

import { AuthData } from "./auth.model";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from '../../environments/environment'
const USER_URL = environment.api_url + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
    expiresIn: any;
    private token: string;
    private tokenTimer: any;
    private isAuthenticated = false;
    private userId: string;
    private authStatusListener = new Subject<boolean>();
    constructor(private http: HttpClient, private router: Router) {}

    createUser(email: string, password: string) {
        const authData: AuthData = {email : email, password: password};
        this.http.post(USER_URL + 'signup', authData)
        .subscribe(response => {
            this.router.navigate(['/']);
        }, error => {
            // inform the app that auth failed
            this.authStatusListener.next(false);
            this.router.navigate(['/signup']);
        });
    }

    login(email: string, password: string) {
        const authData: AuthData = {email : email, password: password};
        this.http.post<{token: string, expiresIn: number, userId: string}>(USER_URL + 'login', authData)
        .subscribe(response => {
            // response is the token
            this.token = response.token;
            if (this.token) {
                this.expiresIn = response.expiresIn;
                this.userId = response.userId;
                this.setAuthTimer(this.expiresIn);
                this.authStatusListener.next(true);
                this.isAuthenticated = true;
                const now = new Date();
                this.saveAuthData(this.token, new Date(now.getTime() + this.expiresIn * 1000), this.userId);
                this.router.navigate(['/']);
            }
        });
    }

    logout() {
     this.token = null;
     this.userId = null;
     this.isAuthenticated = false;
     this.authStatusListener.next(false);
     this.router.navigate(['/']);
     clearTimeout(this.tokenTimer);
     this.clearAuthData();
    }

    getToken() {
        return this.token;
    }

    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    setAuthTimer(expiryTime) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, expiryTime * 1000);
    }

    // For on reload scenario this will be called
    autoAuthUser() {
        const authInfo = this.getAuthData();
        // authinfo may or may not exist in case of reload
        // 1. reload after logout 2. reload when logged in
        if (!authInfo) {
            return;
        }
        const now = new Date();
        // expiration should be greater than the now time
        const expiresInVal = authInfo.expirationDate.getTime() - now.getTime();
        if (expiresInVal > 0) {
            console.log('reload ---- token expiry time', expiresInVal);
            this.token = authInfo.token;
            this.userId = authInfo.userId;
            this.authStatusListener.next(true);
            this.setAuthTimer(expiresInVal / 1000);
            this.isAuthenticated = true;
        }
    }
    saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    getAuthData() {
        const token = localStorage.getItem('token');
        const expiry = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expiry) {
           return;
        }
        return {
            token: token,
            expirationDate : new Date(expiry),
            userId: userId
        };
    }
}
