import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthenticationDataModel } from "./authentication.data.model";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

    private isAuthenticated: boolean = false;
    private token: any;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();

    getToken() {
        return this.token;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuth(): boolean {
        return this.isAuthenticated;
    }

    constructor(private httpClient: HttpClient, private router: Router) {

    }

    public createUser(authenticationData: AuthenticationDataModel) {
        this.httpClient.post('http://localhost:3000/api/v1/users/signup', authenticationData).subscribe((response) => {
            console.log(response)
            // TODO: redirect to confirmation page
            this.router.navigate(['/']);
        });
    }

    public login(authenticationData: AuthenticationDataModel) {
        this.httpClient.post('http://localhost:3000/api/v1/users/login', authenticationData).subscribe((response: any) => {
            console.log(response)
            const token = response.token;
            this.token = token;
            if (token) {
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const now: Date = new Date();
                const expirationDate: Date = new Date(now.getTime() + expiresInDuration * 1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate);
                this.router.navigate(['/dashboard']);
            }
        }, error => {
          this.authStatusListener.next(false);
        });
    }

    logout(): void {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    autoAuthUser() {
      const authInformation = this.getAuthData();
      console.log(authInformation);
      if (!authInformation) {
        return;
      }

      const now = new Date();
      // In Ms
      const expiresIn = authInformation.expirationDate.getTime()
       - now.getTime();
       console.log(authInformation, expiresIn);
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        // Works with seconds so we have to divide by 1000
        this.setAuthTimer(expiresIn / 1000)
        this.authStatusListener.next(true);
      }
    }

    private saveAuthData(token: string, expirationDate: Date) {
      localStorage.setItem('token', token);
      localStorage.setItem('expirationDate', expirationDate.toISOString())
    }

    private setAuthTimer(duration: number) {
      console.log('Setting timer: ' + duration);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    }

    getAuthData() {
      const token = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expirationDate');
      if (!token || !expirationDate) {
        return;
      }
      return {token, expirationDate: new Date(expirationDate)}
    }

    private clearAuthData() {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
    }

}
