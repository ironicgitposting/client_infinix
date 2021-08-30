import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { User } from './user.model';
import {Observable, Subject} from 'rxjs';
import { Deserialize } from 'cerialize';
import { LoanDataModel } from '../loan/loan.data.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];
  private usersUpdated = new Subject<{users: User[]}>();

  constructor(private http: HttpClient, private router: Router ) {}

  public getUsers(): Observable<any> {
    return this.http.get('http://localhost:3000/api/v1/users').pipe(
      map((response: any) => Deserialize(response.users, User))
    );
  }

  getUserUpdateListener(): Observable<any> {
    return this.usersUpdated.asObservable();
  }

  enableOrDisableUser(user: User) {
    return this.http.put<any>('http://localhost:3000/api/v1/users/toggleUser/' + user.email, user).subscribe();
  }

  updateUser(user: User): Observable<any> {
    return this.http.put<any>('http://localhost:3000/api/v1/users/update/' + user.email, user);
  }

  deleteUser(user: User) {
    return this.http.post<any>('http://localhost:3000/api/v1/users/delete/' + user.email, user).subscribe();
  }
}
