import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators'

import { Router } from "@angular/router";
import { User } from "./user.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];
  private usersUpdated = new Subject<{users: User[]}>();

  constructor(private http: HttpClient, private router: Router ) {}

  getUsers() {
    this.http.get<{users: any}>('http://localhost:3000/api/v1/users')
    .pipe(map((postData) => {
      return {users: postData.users.map((user: any) => {
        return {
          surname: user.surname,
          name: user.name,
          profession: user.profession,
          email: user.email,
          telephone: user.telephone,
          authorizationnAccess: user.authorizationnAccess,
          dateLastSeen: user.dateLastSeen,
          site: user.site,
          language: user.language,
          archived: user.archived
        }
      })}
    }))
    .subscribe((transformedUserData) => {
      this.users = transformedUserData.users;
      this.usersUpdated.next({
        users: [...this.users]
      })
      console.log(this.users);
    })
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }
}