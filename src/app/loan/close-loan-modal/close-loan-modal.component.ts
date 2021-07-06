import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoanDataModel } from '../loan.data.model';

@Component({
    selector: 'dialog-modal',
    templateUrl: './close-loan-modal.component.html',
    styleUrls: ['./close-loan-modal.component.less']
})
export class CloseLoanModalComponent implements OnInit {

    constructor(
        private dialogRef: MatDialogRef<CloseLoanModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            loan: LoanDataModel;
        }
    ) { }

    ngOnInit(): void {

    }

    public close(saved: boolean = false): void {
        const loan: LoanDataModel = new LoanDataModel();
        if (saved) {
            if (this.data && this.data.loan) {
                loan.id = this.data.loan.id;
            }
        }
        this.dialogRef.close({ saved: saved, loan: loan });
    }
}