import { OnDestroy } from "@angular/core";
import { AfterViewInit, Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { User } from "./user.model";
import { UserService } from "./usersList.service";

@Component({
  selector: 'usersList',
  templateUrl: './usersList.component.html',
  styleUrls: ['./usersList.component.less']
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {

  users: User[] = [];
  private usersSub: Subscription;

  constructor(private userService: UserService) {

  }

  public ngOnInit() {
    this.userService.getUsers();
    this.usersSub = this.userService.getUserUpdateListener()
      .subscribe((userData: {users: User[]}) => {
        this.users = userData.users;
      });

  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

  public ngAfterViewInit() {

  }

  isEmptyUsers() {
    return this.users.length == 0;
  }

}
