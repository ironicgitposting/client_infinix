import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from "../../vehicle.model";
import { VehicleService } from "../../vehicle-list.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'dialog-modal',
    templateUrl: './vehicleModal.html',
    styleUrls: ['../../vehicles-list.component.less']
  })
  export class UpdateVehicleModal implements OnInit {
    public modalVehicle: Vehicle;
  
    constructor(
      private vehicleService: VehicleService,
      public dialogRef: MatDialogRef<UpdateVehicleModal>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ){}
  
    ngOnInit(){
      this.modalVehicle = this.data.vehicle;
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    onConfirmClick(ngForm: NgForm){
      console.log(ngForm.form.value.status);
      if (ngForm.valid){
        const lastImmatriculation = this.modalVehicle.immatriculation;
        const newVehicle: Vehicle = {
          type: ngForm.form.value.type,
          libelle: ngForm.form.value.libelle,
          Site: ngForm.form.value.site,
          model: ngForm.form.value.model, 
          flagService: ngForm.form.value.flagService, 
          status: ngForm.form.value.status,
          immatriculation: ngForm.form.value.immatriculation,
          state: ngForm.form.value.state 
  
          //TO DO: a compléter pour les images vehicles
        }
        
        this.vehicleService.updateVehicle(newVehicle, lastImmatriculation);
        this.dialogRef.close();
      }
    }
  
  }