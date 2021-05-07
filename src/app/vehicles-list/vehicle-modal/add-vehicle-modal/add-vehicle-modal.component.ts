import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from "../../vehicle.model";
import { VehicleService } from "../../vehicle-list.service";
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-modal',
    templateUrl: './add-vehicle-modal.html',
    styleUrls: ['../../vehicles-list.component.less']
  })
  export class AddVehicleModal implements OnInit {
  
    public modalVehicle: Vehicle;
  
    constructor(
      private vehicleService: VehicleService,
     
      public dialogRef: MatDialogRef<AddVehicleModal>){}
  
    ngOnInit(){
      
    }
  
    close(){
      this.dialogRef.close();
    }
  }