import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { User } from '../../users-list/user.model';
import { Subscription } from 'rxjs';
import { LoanService } from '../loan.service';
import { UserService } from '../../users-list/usersList.service';

@Component({
  selector: 'app-loan-modal',
  templateUrl: './loan-modal.component.html',
  styleUrls: ['./loan-modal.component.less']
})
export class LoanModalComponent implements OnInit {

  public get isReadOnlyMode(): boolean {
    return this.data.isReadOnly;
  }

  public loanForm: FormGroup;

  public drivers: User[] = [];

  private usersSub: Subscription;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoanModalComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: {
              isReadOnly: boolean;
              mode: string;
              // TODO: Typer avec le model
              loan: any;
  }) {
      this.loanForm = this.fb.group({
      driver: new FormControl('', Validators.required),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', []),
      acceptPassengers: new FormControl('', [])
    });
  }

  ngOnInit(): void {
    this.userService.getUsers();
    this.usersSub = this.userService.getUserUpdateListener()
      .subscribe((userData: {users: User[]}) => {
        this.drivers = userData.users;
      });
  }

  public isNewMode(): boolean {
    return this.data.mode === 'new';
  }

  public isReadMode(): boolean {
    return this.data.mode === 'read';
  }

  public isUpdateMode(): boolean {
    return this.data.mode === 'update';
  }

  public close(saved: boolean = false): void {
    const loan: any = {};
    this.dialogRef.close({ saved: saved, loan: loan });
  }

  public isSaveDisabled(): boolean {
    return this.loanForm.touched && this.loanForm.valid;
  }
}
