import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthenticationDataModel } from './authentication.data.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private isAuthenticated = false;
  private token: string | null;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isAdmin: boolean = false;

  getToken(): string | null {
    return this.token;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  // tslint:disable-next-line:typedef
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  constructor(private httpClient: HttpClient, private router: Router) {}

  public createUser(authenticationData: AuthenticationDataModel): void {
    this.httpClient
      .post('http://localhost:3000/api/v1/users/signup', authenticationData)
      .subscribe((response) => {
        console.log(response);
        // TODO: redirect to confirmation page
        this.router.navigate(['/']);
      });
  }

  public login(authenticationData: AuthenticationDataModel): void {
    this.httpClient
      .post('http://localhost:3000/api/v1/users/login', authenticationData)
      .subscribe(
        (response: any) => {
          console.log(response);

          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            const user = response.user;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            if (user.authorizationAccess == 1) {
              // Is Admin
              this.isAdmin = true;
            }
            this.authStatusListener.next(true);
            const now: Date = new Date();
            const expirationDate: Date = new Date(
              now.getTime() + expiresInDuration * 1000,
            );
            this.saveAuthData(token, expirationDate, user);
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        },
      );
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    console.log(authInformation);
    if (!authInformation) {
      return;
    }

    const now = new Date();
    // In Ms
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      // Works with seconds so we have to divide by 1000
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    user: AuthenticationDataModel,
  ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('connectedUser', JSON.stringify(user));
  }

  private setAuthTimer(duration: number): void {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const connectedUser = localStorage.getItem('connectedUser');
    if (!token || !expirationDate || !connectedUser) {
      return;
    }
    return { token, expirationDate: new Date(expirationDate), connectedUser };
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('connectedUser');
  }

  sendPasswordResetMail(email: string) {
    this.httpClient
      .post('http://localhost:3000/api/v1/users/resetPassword/' + email, {
        email: email,
      })
      .subscribe((response) => {
        debugger;
        console.log(response);
        // TODO: redirect to confirmation page
        this.router.navigate(['/']);
      });
  }
}
