import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanDataModel } from '../loan/loan.data.model';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.less']
})
export class ConfirmComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
    message: string
  }) {}

  ngOnInit(): void {
  }

  public close(yesAnswer: boolean = false): any {
    this.dialogRef.close(yesAnswer);
  }

}
