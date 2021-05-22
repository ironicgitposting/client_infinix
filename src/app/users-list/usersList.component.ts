import { OnDestroy } from '@angular/core';
import { AfterViewInit, Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './user.model';
import { UserService } from './usersList.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'usersList',
  templateUrl: './usersList.component.html',
  styleUrls: ['./usersList.component.less']
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {

  users: User[] = [];

  constructor(private userService: UserService, public dialog: MatDialog) {

  }

  public ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {

  }

  public ngAfterViewInit() {

  }

  isEmptyUsers() {
    return this.users.length == 0;
  }

  openDialog(user: User): void {
    const dialogRef = this.dialog.open(DialogUser, {
      data: {
        user,
      },
    });
  }

  deleteUser(user: User): void {
    if (user.email) {
      this.userService.deleteUser(user);
    }
  }

  onUserSwitchToggle($event: MatSlideToggleChange, user: User): void {
    user.enabled = $event.checked;
    this.userService.updateUser(user);
  }
}

@Component({
  selector: 'dialog-modal',
  templateUrl: './userModal.html',
  styleUrls: ['./usersList.component.less'],
})
export class DialogUser implements OnInit {

  public modalUser: User;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogUser>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.modalUser = this.data.user;
    console.log(this.modalUser);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(ngForm: NgForm) {

    if (ngForm.valid) {
      const newUser: User = new User();
      newUser.email = ngForm.form.value.email;
      newUser.surname = ngForm.form.value.surname;
      newUser.name = ngForm.form.value.name;
      newUser.profession = ngForm.form.value.profession;
      newUser.telephone = ngForm.form.value.telephone;
      // TODO: A COMPLETER
      console.log(ngForm);
      this.userService.updateUser(newUser);
      this.router.navigate(['/users']);

    }

  }
}
