import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from "./vehicle.model";
import { VehicleService } from "./vehicle-list.service";
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { AddVehicleModal } from './vehicle-modal/add-vehicle-modal/add-vehicle-modal.component';
import { HistoricalVehicleModal } from './vehicle-modal/historical-vehicle-modal/historical-vehicule-modal.component';
import { UpdateVehicleModal } from './vehicle-modal/update-vehicle-modal/update-vehicle-modal.component';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight:'0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')) ]),
],
})
export class VehiclesListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  
  vehicles: Vehicle[] = [];
  private vehiclesSub: Subscription;

  ELEMENT_DATA : Vehicle[];
  columnsToDisplay: string[] = ['model', 'libelle', 'immatriculation', 'state', 'status'];

  columnsName: {
    [model : string]: string;
    immatriculation: string;
    state: string;
    status: string;
    libelle: string;
  } = {
    model: 'Modele',
    immatriculation: 'Immatriculation',
    state: 'Etat',
    status: 'Statut',
    libelle: 'Marque'
  };

  expandedElement: Vehicle | null;

  etats = ['En validation', 'Validé', 'En cours', 'En retard', 'Clôturé']

  dataSource: MatTableDataSource<any>;
    
  constructor(private vehicleService: VehicleService, public dialog: MatDialog) { 
    
  }

  
  ngOnInit() {
    this.vehicleService.getVehicles().subscribe(vehicle => {
      this.ELEMENT_DATA = vehicle.vehicules;
     
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      
      this.dataSource.sort = this.sort;
      
    });
  }

  ngOnDestroy(): void {
    
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
    const dialogRef = this.dialog.open(UpdateVehicleModal, {
      data: {
        vehicle
      },
      width: '512px',
    });
  }

  historicalVehicle(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(HistoricalVehicleModal, {
      data: {
        vehicle
      },
      
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addVehicle(): void {
    const dialogRef = this.dialog.open(AddVehicleModal, {

    });
  }
}