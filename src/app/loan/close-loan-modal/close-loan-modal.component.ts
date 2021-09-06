import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoanDataModel } from '../loan.data.model';
import { Vehicle } from 'src/app/vehicles-list/vehicle.model';
import { StatusModel } from '../../common/models/StatusModel';

@Component({
  selector: 'dialog-modal',
  templateUrl: './close-loan-modal.component.html',
  styleUrls: ['./close-loan-modal.component.less'],
})
export class CloseLoanModalComponent implements OnInit {

  public closeloanForm: FormGroup;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<CloseLoanModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                mode: string;
                loan: LoanDataModel;
              },
  ) {
    this.closeloanForm = this.fb.group({
      commentloan: new FormControl({ value: '', disabled: this.isReadMode() }, [Validators.required]),
      essenceloan: new FormControl({ value: '', disabled: this.isReadMode() }, [Validators.required]),
      kilometreloan: new FormControl({ value: '', disabled: this.isReadMode() }, [Validators.required]),
    });
  }

  ngOnInit(): void {

  }

  /**
   * Est-on en mode création
   */
  public isNewMode(): boolean {
    return this.data.mode === 'new';
  }

  /**
   * Est-on en mode lecture
   */
  public isReadMode(): boolean {
    return this.data.mode === 'read';
  }

  /**
   * Est-on en mode modification
   */
  public isUpdateMode(): boolean {
    return this.data.mode === 'update';
  }

  public close(saved: boolean = false): void {
    const loan: LoanDataModel = new LoanDataModel();
    const vehicle: Vehicle = new Vehicle();
    if (saved) {
      if (this.data && this.data.loan) {
        loan.id = this.data.loan.id;
        loan.lentVehicule = new Vehicle();
        loan.lentVehicule.id = this.data.loan.lentVehicule.id;
        loan.kilometrage = this.closeloanForm.controls['kilometreloan'].value;
        loan.essence = this.closeloanForm.controls['essenceloan'].value;
        loan.commentLoan = this.closeloanForm.controls['commentloan'].value;
      }
    }
    this.dialogRef.close({ saved: saved, loan: loan });
  }


  /**
   * Détermine l'état du bouton de sauvegarde
   */
  public isSaveDisabled(): boolean {
    return this.closeloanForm.touched && this.closeloanForm.valid;
  }
}
