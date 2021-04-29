import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from "./vehicle.model";
import { VehicleService } from "./vehicle-list.service";
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';

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
    libelle: 'Libelle'
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
  /*
  ngOnInit() {
    console.log(this.vehicleService.getVehicles);
    this.vehicleService.getVehicles();
    this.vehiclesSub = this.vehicleService.getVehicleUpdateListener()
      .subscribe((vehicleData: {vehicles: Vehicle[]}) => {
        this.vehicles = vehicleData.vehicles;
        
      });
  }*/

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
      },
      width: '512px',
    });
  }

  historicalVehicle(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(HistoricalVehicle, {
      data: {
        vehicle
      },
      
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    console.log(ngForm.form.value.status);
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

        //TO DO: a compléter pour les images vehicles
      }
      
      this.vehicleService.updateVehicle(newVehicle, lastImmatriculation);
      this.dialogRef.close();
    }
  }

}

@Component({
  selector: 'dialog-modal',
  templateUrl: './historicalVehicleModal.html',
  styleUrls: ['./vehicles-list.component.less']
})
export class HistoricalVehicle implements OnInit {
  public modalVehicle : Vehicle;

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
}
