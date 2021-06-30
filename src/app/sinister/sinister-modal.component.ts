import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../vehicles-list/vehicle.model';

@Component({
  selector: 'dialog-modal',
  templateUrl: './sinister-modal.html',
  styleUrls: ['./sinister-modal.component.less'],
})
export class SinisterModal implements OnInit {

  public sinisterForm: FormGroup;

  public vehicles: Vehicle;

  constructor(private dialogRef: MatDialogRef<SinisterModal>,
              private fb: FormBuilder){}

  ngOnInit() {
       
  };

  public close(saved: boolean = false): void {
     
    this.dialogRef.close();
  }
}