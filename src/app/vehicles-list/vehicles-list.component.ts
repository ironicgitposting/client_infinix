import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from './vehicle.model';
import { VehicleService } from './vehicle-list.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';

import { HistoricalVehicleModal } from './historical-vehicle-modal/historical-vehicule-modal.component';
import { VehicleModal } from './vehicle-modal/vehicle-modal.component';
import { MessageService } from '../common/services/message.service';
import { Device } from '../common/device';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))]),
  ],
})
export class VehiclesListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  vehicles: Vehicle[] = [];
  private vehiclesSub: Subscription;

  ELEMENT_DATA: Vehicle[];
  columnsToDisplay: string[] = ['model', 'libelle', 'immatriculation', 'state', 'status'];

  columnsName: {
    [model: string]: string;
    immatriculation: string;
    state: string;
    status: string;
    libelle: string;
  } = {
    model: 'Modele',
    immatriculation: 'Immatriculation',
    state: 'Etat',
    status: 'Statut',
    libelle: 'Marque',
  };

  expandedElement: Vehicle | null;

  etats = ['En validation', 'Validé', 'En cours', 'En retard', 'Clôturé'];

  dataSource: MatTableDataSource<Vehicle>;

  constructor(private vehicleService: VehicleService,
              public dialog: MatDialog,
              private msgService: MessageService) {

  }


  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy(): void {

  }

  isEmptyVehicles() {
    return this.vehicles.length === 0;
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (confirm('Are you sure to delete ')) {
      if (vehicle.immatriculation) {
        this.vehicleService.deleteVehicle(vehicle).subscribe(() => {
          this.fetchData();
        });
      }
    }
  }

  fetchData() {
    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.ELEMENT_DATA = vehicles;
      console.log(this.ELEMENT_DATA);
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      console.log(this.dataSource);
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(VehicleModal, {
      data: {
        vehicle,
      },
      width: '512px',
    });
  }

  historicalVehicle(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(HistoricalVehicleModal, {
      data: {
        vehicle,
      },

    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Ouverture de la modale d'ajout de véhicule
   * @param isReadOnly En lecture seule ou non
   * @param mode Mode d'ouverture => Création / modification
   * @param lastImmatriculation En cas de modification de l'immatriculation il nous faut l'ancienne pour update
   */
  openVehicleModal(mode: string, vehicle: Vehicle | null, lastImmatriculation: string | null): void {
    const dialogRef = this.dialog.open(VehicleModal, {
      data: { mode: mode, vehicle: vehicle, lastImmatriculation: lastImmatriculation },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.saved && !lastImmatriculation) {
        this.vehicleService.createVehicle(result.vehicle).subscribe(response => {
          this.msgService.snackbar('Véhicule enregistré', 'success');
          this.fetchData();
        });
      } else if (result && result.saved && lastImmatriculation) {
        this.vehicleService.updateVehicle(result.vehicle, lastImmatriculation).subscribe(response => {
          this.msgService.snackbar('Véhicule modifié');
          this.fetchData();
        });
      }
    });

  }

  IsMobile(){
    Device.definedUseDevice('vehicle-container');
    return Device.isMobileDevice();
  }
}
