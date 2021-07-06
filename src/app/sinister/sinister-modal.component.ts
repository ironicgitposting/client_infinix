import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatusEnum } from '../common/models/status.enum';
import { StatusModel } from '../common/models/StatusModel';
import { VehicleService } from '../vehicles-list/vehicle-list.service';
import { Vehicle } from '../vehicles-list/vehicle.model';
import { SinisterModel } from './sinister.model';

@Component({
  selector: 'dialog-modal',
  templateUrl: './sinister-modal.html',
  styleUrls: ['./sinister-modal.component.less'],
})
export class SinisterModal implements OnInit {

  public sinisterForm: FormGroup;

  public vehicles: Vehicle[] = [];

  public selectedVehicle: Vehicle;
  
  public vehicleId: number;
  constructor(private dialogRef: MatDialogRef<SinisterModal>,
              private fb: FormBuilder,
              private vehicleService: VehicleService,
              @Inject(MAT_DIALOG_DATA) public data: {
                isReadOnly: boolean;
                mode: string;
                sinister: SinisterModel;
              }){
                this.sinisterForm = this.fb.group({
                  vehicle: new FormControl({value: '', disabled: false}, Validators.required),
                  libelle: new FormControl({value: '', disabled: false}, Validators.required),
                })
              }

  ngOnInit() {
       this.vehicleService.getVehicles().subscribe(vehicles => {
         this.vehicles = vehicles;
       })
  };

  public getVehiculeString(vehicle: Vehicle): string {
    let ret: string = '';
    if (vehicle) {
      ret = `${vehicle.libelle} ${vehicle.model} (${vehicle.immatriculation})`;
    }
    return ret;
  }

  public close(saved: boolean = false): void {
    const sinister: SinisterModel = new SinisterModel();
    if (saved) {
      sinister.libelle = this.sinisterForm.controls['libelle'].value;
      sinister.idVehicle = this.vehicleId;
      sinister.status = new StatusModel();
      sinister.status.id = 100;
      sinister.status.label = StatusEnum.discovered;
    }
    this.dialogRef.close({saved: saved, sinister: sinister});
  }

  public setVehicleId(status: MatOptionSelectionChange, vehicle: Vehicle): void {
    if (status.isUserInput) {
      this.vehicleId = vehicle.id;
    }
  }
}