import { OnDestroy } from "@angular/core";
import { AfterViewInit, Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { User } from "./user.model";
import { UserService } from "./usersList.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: 'usersList',
  templateUrl: './usersList.component.html',
  styleUrls: ['./usersList.component.less']
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {

  users: User[] = [];
  private usersSub: Subscription;

  constructor(private userService: UserService, public dialog: MatDialog) {

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

  openDialog(user: User): void {
    const dialogRef = this.dialog.open(DialogUser, {
      data: {
        user
      }
    });
  }

  deleteUser(user: User): void {
    if (user.email) {
      this.userService.deleteUser(user);
    }
  }
}

@Component({
  selector: 'dialog-modal',
  templateUrl: './userModal.html',
  styleUrls: ['./usersList.component.less']
})
export class DialogUser implements OnInit {

  public modalUser: User;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogUser>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.modalUser = this.data.user;
    console.log(this.modalUser);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(ngForm: NgForm) {

    if (ngForm.valid) {
      const newUser: User = {
        email: ngForm.form.value.email,
        surname: ngForm.form.value.surname,
        name: ngForm.form.value.name,
        profession: ngForm.form.value.profession,
        telephone: ngForm.form.value.telephone
        // TODO: A COMPLETER

      }
      console.log(ngForm);
      this.userService.updateUser(newUser);
      this.router.navigate(['/users']);

    }

  }
}
