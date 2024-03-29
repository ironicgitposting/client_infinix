import { Component, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from './vehicle.model';
import { VehicleService } from './vehicle-list.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';

import { HistoricalVehicleModal } from './historical-vehicle-modal/historical-vehicule-modal.component';
import { VehicleModal } from './vehicle-modal/vehicle-modal.component';
import { MessageService } from '../common/services/message.service';
import { SinisterModal } from '../sinister/sinister-modal.component';
import { Device } from '../common/device';
import { SinisterService } from '../sinister/sinister.service';
import { SinisterModel } from '../sinister/sinister.model';
import { ConfirmComponent } from '../confirm/confirm.component';
import { StatusEnum } from '../common/models/status.enum';
import { StatusModel } from '../common/models/StatusModel';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ArchivedSinistersComponent } from './archived-sinisters/archived-sinisters.component';
import { DatePipe } from '@angular/common';

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

  sinisters: SinisterModel[] = [];

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

  dataSource: MatTableDataSource<Vehicle>;

  constructor(private vehicleService: VehicleService,
              private sinisterService: SinisterService,
              private dialog: MatDialog,
              private datePipe: DatePipe,
              private msgService: MessageService) {

  }

  public ngOnInit(): void {
    this.fetchData();
  }

  public isEmptyVehicles(): boolean {
    return this.vehicles.length === 0;
  }

  public deleteVehicle(vehicle: Vehicle): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      if (vehicle.immatriculation) {
        this.vehicleService.deleteVehicle(vehicle).subscribe(() => {
          this.fetchData();
        });
      }
    }
  }

  formatDateSinistre(date_sinistre: Date){
    const formated_date = this.datePipe.transform(date_sinistre, 'dd/MM/yyyy');
    return formated_date;
  }
  public fetchData(): void {
    this.vehicleService.getVehicles().subscribe(vehicles => {
      this.ELEMENT_DATA = vehicles;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
    });

  }

  public openDialog(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(VehicleModal, {
      data: {
        vehicle,
      },
      width: '512px',
    });
  }

  public historicalVehicle(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(HistoricalVehicleModal, {
      data: {
        vehicle,
      },
      width: '100%',
    });
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Ouverture de la modale d'ajout de véhicule
   * @param vehicle Véhicule concerné
   * @param mode Mode d'ouverture => Création / modification
   * @param lastImmatriculation En cas de modification de l'immatriculation il nous faut l'ancienne pour update
   */
  public openVehicleModal(mode: string, vehicle: Vehicle | null, lastImmatriculation: string | null): void {
    const dialogRef = this.dialog.open(VehicleModal, {
      data: { mode, vehicle, lastImmatriculation },
    });

    dialogRef.afterClosed().subscribe(result => {

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

  /**
   * Ouverture de la modal de création de sinistre
   * Après fermeture on passe le flagService à false et on change l'état
   */
  public openSinisterModal(): void {
    const dialogRef = this.dialog.open(SinisterModal, {
      width: '512px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.saved) {

        this.sinisterService.createSinister(result.sinister).subscribe(response => {
          this.msgService.snackbar('Sinistre enregistré', 'success');
          const selectedVehicle: Vehicle = result.selectedVehicle;
          selectedVehicle.flagService = false;
          selectedVehicle.state = 'Sinistre en cours';
          this.vehicleService.updateVehicle(selectedVehicle, selectedVehicle.immatriculation)
            .subscribe();
          this.fetchData();
        });
      }
    });
  }

  /**
   * Ouverture de la liste des sinistres archivés d'un véhicule
   */
  public openArchivedSinisterModal(vehicle: Vehicle): void {
    this.dialog.open(ArchivedSinistersComponent, {
      data: { vehicle }
    });
  }

  /**
   * Affiche les sinistres par véhicule
   */
  public getSinistersForVehicle(vehicle: Vehicle): void {
    this.sinisterService.getSinisters(vehicle.id, 100).subscribe(sinisters => {
      this.sinisters = sinisters;
    });

  }

  /**
   * Ouvre une modal et supprime un sinistre, si plus de sinistre actif, change l'etat du véhicule
   */
  public deleteSinister(sinister: SinisterModel, vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { message: 'Êtes-vous sûr de vouloir archiver ce sinistre ?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        sinister.status = new StatusModel();
        sinister.status.id = 300;
        sinister.status.label = StatusEnum.solved;

        this.sinisterService.updateSinister(sinister).subscribe(response => {
          this.msgService.snackbar('Sinistre archivé !', 'success');
          this.hasSinister(vehicle);
          this.fetchData();
        });

      }

    });
  }

  /**
   * Compte les sinistres pour un véhicule, si il n'y en a pas, on change le state du véhicule
   */
  public hasSinister(vehicle: Vehicle): void {
    this.sinisterService.getSinisters(vehicle.id, 100).subscribe(sinisters => {
      if (sinisters.length === 0) {
        const selectedVehicle: Vehicle = vehicle;
        selectedVehicle.state = 'Sinistres terminés';
        this.vehicleService.updateVehicle(selectedVehicle, selectedVehicle.immatriculation).subscribe(response => {
          this.fetchData();
        });
      }
    });
  }

  public onVehicleSwitchToggle($event: MatSlideToggleChange, vehicle: Vehicle): void {
    vehicle.flagService = $event.checked;
    this.vehicleService.updateVehicle(vehicle, vehicle.immatriculation).subscribe(response => {
      this.msgService.snackbar('Disponibilité modifiée');
    });
  }

  public isMobile(): boolean {
    Device.definedUseDevice('vehicle-container');
    return Device.isMobileDevice();
  }
}
