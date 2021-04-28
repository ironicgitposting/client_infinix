import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../users-list/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../users-list/usersList.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { LoanDataModel } from '../loan.data.model';

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

  public sites: any[] = [];

  private usersSub: Subscription;

  public driverId: number | undefined = 1;

  public siteId: number | undefined = 1;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoanModalComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: {
              isReadOnly: boolean;
              mode: string;
              loan: any;
  }) {
      this.loanForm = this.fb.group({
      driver: new FormControl('', Validators.required),
      departureSite: new FormControl('', Validators.required),
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
    if (this.data.loan) {
      console.log(this.data.loan);
      this.loanForm.controls['driver'].setValue(this.data.loan['User'].surname + ' ' + this.data.loan['User'].name);
      this.loanForm.controls['departureSite'].setValue(this.data.loan['Site'].label);
      this.loanForm.controls['start'].setValue(this.data.loan.startDate);
      this.loanForm.controls['end'].setValue(this.data.loan.endDate);
    }
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
    const loan: LoanDataModel = {};
    if (saved) {
      loan.driver = this.driverId;
      loan.departureSite = this.siteId;
      loan.lentVehicule = null;
      loan.startDate = this.loanForm.controls['start'].value.toDate();
      if (this.loanForm.controls['end'].value !== '') {
        loan.endDate = this.loanForm.controls['end'].value.toDate();
      } else {
        loan.endDate = null;
      }
      loan.status = 1;
    }
    this.dialogRef.close({ saved: saved, loan: loan });
  }

  public isSaveDisabled(): boolean {
    return this.loanForm.touched && this.loanForm.valid;
  }

  public setDriverId(status: MatOptionSelectionChange, driver: any): void {
    if (status.isUserInput) {
      this.driverId = driver.id;
    }
  }

  public setSiteId(status: MatOptionSelectionChange, site: any): void {
    if (status.isUserInput) {
      this.siteId = site.id;
    }
  }
}
