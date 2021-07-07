import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../users-list/user.model';
import { UserService } from '../../users-list/usersList.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { LoanDataModel } from '../loan.data.model';
import { SiteDataModel } from '../../sites-list/site.model';
import { StatusModel } from '../../common/models/StatusModel';
import { SiteService } from '../../sites-list/sitesList.service';
import { StatusEnum } from '../../common/models/status.enum';
import { Vehicle } from '../../vehicles-list/vehicle.model';
import { VehicleService } from '../../vehicles-list/vehicle-list.service';
import { Device } from '../../common/device';
import * as moment from 'moment';

@Component({
  selector: 'app-loan-modal',
  templateUrl: './loan-modal.component.html',
  styleUrls: ['./loan-modal.component.less']
})
export class LoanModalComponent implements OnInit {

  /**
   * FormGroup des prêts
   */
  public loanForm: FormGroup;

  /**
   * Liste des utilisateurs pouvant être conducteurs
   */
  public drivers: User[] = [];

  /**
   * Liste des sites
   */
  public sites: SiteDataModel[] = [];

  public vehicules: Vehicle[] = [];

  public selectedDriver: User = new User();

  public selectedDepartureSite: SiteDataModel = new SiteDataModel();

  public selectedArrivalSite: SiteDataModel = new SiteDataModel();

  public selectedVehicule: Vehicle;

  public oneVehiculeAlreadylinked: boolean = false;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoanModalComponent>,
              private userService: UserService,
              private siteService: SiteService,
              private vehicleService: VehicleService,
              @Inject(MAT_DIALOG_DATA) public data: {
              isReadOnly: boolean;
              mode: string;
              loan: LoanDataModel;
  }) {
      this.loanForm = this.fb.group({
      driver: new FormControl({value: '', disabled: this.isReadMode() || this.isValidateMode()}, Validators.required),
      departureSite: new FormControl({value: '', disabled: this.isReadMode() || this.isValidateMode()}, Validators.required),
      arrivalSite: new FormControl({value: '', disabled: this.isReadMode() || this.isValidateMode()}, Validators.required),
      start: new FormControl({value: '', disabled: this.isReadMode() || this.isValidateMode()}, [Validators.required]),
      end: new FormControl({value: '', disabled: this.isReadMode() || this.isValidateMode()}, []),
      acceptPassengers: new FormControl({value: '', disabled: this.isReadMode() || this.isValidateMode()}, []),
      lentVehicule: new FormControl({value: '', disabled: this.isReadMode()}, [])
    });
  }

  ngOnInit(): void {
    const localStorageUser: User = JSON.parse(localStorage.getItem('connectedUser') || '');
    if (localStorageUser && localStorageUser.authorizationAccess !== 1) {
      this.loanForm.controls['driver'].setValue(localStorageUser.surname + ' ' + localStorageUser.name);
      this.selectedDriver = localStorageUser;
      this.loanForm.controls['driver'].disable();
    } else {
      this.userService.getUsers().subscribe(users => {
          this.drivers = users;
      });
    }
    this.siteService.getSitesAvailable().subscribe(sites => {
      this.sites = sites;
    });
    if (this.data.loan) {
      this.vehicleService.getAvailableVehicles(this.data.loan.startDate, this.data.loan.endDate).subscribe(vehicles => {
        this.vehicules = vehicles;
      });
      // On alimente le formgroup avec les valeurs de la réservation
      this.loanForm.controls['driver'].setValue(this.data.loan.driver.surname + ' ' + this.data.loan.driver.name);
      this.selectedDriver = this.data.loan.driver;
      this.loanForm.controls['departureSite'].setValue(this.data.loan.departureSite.label);
      this.selectedDepartureSite = this.data.loan.departureSite;
      this.loanForm.controls['arrivalSite'].setValue(this.data.loan.arrivalSite.label);
      this.selectedArrivalSite = this.data.loan.arrivalSite;
      this.loanForm.controls['start'].setValue(moment(this.data.loan.startDate));
      if (this.data.loan.endDate) {
        this.loanForm.controls['end'].setValue(moment(this.data.loan.endDate));
      }
      if (this.data.loan.lentVehicule) {
        this.loanForm.controls['lentVehicule'].setValue(this.getVehiculeString(this.data.loan.lentVehicule));
        this.selectedVehicule = this.data.loan.lentVehicule;
        this.oneVehiculeAlreadylinked = true;
      }
    }
  }

  public getVehiculeString(vehicle: Vehicle): string {
    let ret: string = '';
    if (vehicle) {
      ret = `${vehicle.libelle} ${vehicle.model} (${vehicle.immatriculation})`;
    }
    return ret;
  }

  /**
   * Est-on en mode création
   */
  public isNewMode(): boolean {
    return this.data.mode === 'new';
  }

  /**
   * Est-on en mode lecture
   */
  public isReadMode(): boolean {
    return this.data.mode === 'read';
  }

  /**
   * Est-on en mode modification
   */
  public isUpdateMode(): boolean {
    return this.data.mode === 'update';
  }

  /**
   * Est-on en mode modification
   */
  public isValidateMode(): boolean {
    return this.data.mode === 'validate';
  }

  /**
   * Ferme la modale sans enregistrer si on ferme depuis Annuler ou la croix
   * Sinon alimente l'objet loan et l'envoi au composant parent pour sauvegarde
   * @param saved On sauvegarde ou non
   */
  public close(saved: boolean = false): void {
    const loan: LoanDataModel = new LoanDataModel();
    if (saved) {
      if (this.data && this.data.loan) {
        loan.id = this.data.loan.id;
      }
      loan.driver = new User();
      loan.driver = this.selectedDriver;
      loan.departureSite = new SiteDataModel();
      loan.departureSite = this.selectedDepartureSite;
      loan.arrivalSite = new SiteDataModel();
      loan.arrivalSite = this.selectedArrivalSite;
      loan.startDate = this.loanForm.controls['start'].value.toDate();
      if (this.loanForm.controls['end'].value !== '' && this.loanForm.controls['end'].value) {
        loan.endDate = this.loanForm.controls['end'].value.toDate();
      } else {
        loan.endDate = null;
      }
      loan.status = new StatusModel();
      loan.status.id = 1;
      loan.status.label = StatusEnum.awaitingValidation;
      loan.lentVehicule = this.selectedVehicule;
    }
    this.dialogRef.close({ saved: saved, loan: loan });
  }

  /**
   * Détermine l'état du bouton de sauvegarde
   */
  public isSaveDisabled(): boolean {
    return this.loanForm.touched && this.loanForm.valid;
  }

  /**
   * On récupère l'id du choix car le matSelect ne contient pas l'objet mais que du texte
   * @param status Evènement du matSelect pour qu'il ne se déclenche qu'une fois
   * @param driver Conducteur choisi
   */
  public setDriver(status: MatOptionSelectionChange, driver: User): void {
    if (status.isUserInput) {
      this.selectedDriver = driver;
    }
  }

  /**
   * On récupère l'id du choix car le matSelect ne contient pas l'objet mais que du texte
   * @param status Evènement du matSelect pour qu'il ne se déclenche qu'une fois
   * @param site Site choisi
   */
  public setDepartureSite(status: MatOptionSelectionChange, site: SiteDataModel): void {
    if (status.isUserInput) {
      this.selectedDepartureSite = site;
    }
  }

  /**
   * On récupère l'id du choix car le matSelect ne contient pas l'objet mais que du texte
   * @param status Evènement du matSelect pour qu'il ne se déclenche qu'une fois
   * @param site Site choisi
   */
  public setArrivalSite(status: MatOptionSelectionChange, site: SiteDataModel): void {
    if (status.isUserInput) {
      this.selectedArrivalSite = site;
    }
  }

  public setLinkedVehicle(status: MatOptionSelectionChange, vehicule: Vehicle): void {
    if (status.isUserInput) {
      this.selectedVehicule = vehicule;
    }
  }

  public getMaxDate(): Date | string {
    if (this.loanForm.controls['end'].value !== '' && this.loanForm.controls['end'].value) {
      return this.loanForm.controls['end'].value;
    }
    return '';
  }

  public getMinDate(): Date | string {
    if (this.loanForm.controls['start'].value !== '' && this.loanForm.controls['start'].value) {
      return this.loanForm.controls['start'].value;
    }
    return '';
  }

  IsMobile(){
    Device.definedUseDevice('loan-modal');
    return Device.isMobileDevice();
  }
}
