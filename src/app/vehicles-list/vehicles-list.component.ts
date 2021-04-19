import { Component, Inject, OnInit } from '@angular/core';
import { Vehicle } from "./vehicle.model";
import { VehicleService } from "./vehicle-list.service";
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.less']
})
export class VehiclesListComponent implements OnInit {

  vehicles: Vehicle[] = [];
  private vehiclesSub: Subscription;

  constructor(private vehicleService: VehicleService, public dialog: MatDialog) { }

  ngOnInit() {
    this.vehicleService.getVehicles();
    this.vehiclesSub = this.vehicleService.getVehicleUpdateListener()
      .subscribe((vehicleData: {vehicles: Vehicle[]}) => {
        this.vehicles = vehicleData.vehicles;
      });
  }

  ngOnDestroy(): void {
    this.vehiclesSub.unsubscribe();
  }

  isEmptyVehicles() {
    return this.vehicles.length == 0;
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (vehicle.immatriculation) {
      this.vehicleService.deleteVehicle(vehicle);
    }
  }

  openDialog(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(DialogVehicle, {
      data: {
        vehicle
      }
    });
  }

}

@Component({
  selector: 'dialog-modal',
  templateUrl: './vehicleModal.html',
  styleUrls: ['./vehicles-list.component.less']
})
export class DialogVehicle implements OnInit {
  public modalVehicle: Vehicle;

  constructor(
    private vehicleService: VehicleService,
    public dialogRef: MatDialogRef<DialogVehicle>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(){
    this.modalVehicle = this.data.vehicle;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(ngForm: NgForm){
    if (ngForm.valid){
      const lastImmatriculation = this.modalVehicle.immatriculation;
      const newVehicle: Vehicle = {
        type: ngForm.form.value.type,
        libelle: ngForm.form.value.libelle,
        site: ngForm.form.value.site,
        model: ngForm.form.value.model, 
        flagService: ngForm.form.value.flagService, 
        status: ngForm.form.value.status,
        immatriculation: ngForm.form.value.immatriculation,
        state: ngForm.form.value.state 

        //TO DO: a compléter pour les images
      }
      
      this.vehicleService.updateVehicle(newVehicle, lastImmatriculation);
      this.dialogRef.close();
    }
  }

}