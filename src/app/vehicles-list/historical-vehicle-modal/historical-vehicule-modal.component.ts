import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from "../vehicle.model";
import { VehicleService } from "../vehicle-list.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-modal',
    templateUrl: './historicalVehicleModal.html',
    styleUrls: ['../../vehicles-list.component.less']
  })
  export class HistoricalVehicleModal implements OnInit {
    public modalVehicle : Vehicle;
  
   
    constructor(
      private vehicleService: VehicleService,
      public dialogRef: MatDialogRef<HistoricalVehicleModal>,
   
      @Inject(MAT_DIALOG_DATA) public data: any
    ){}
  
    ngOnInit(){
      this.modalVehicle = this.data.vehicle;
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }
  }