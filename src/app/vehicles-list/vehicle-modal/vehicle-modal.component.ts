import { Component, Inject, OnInit } from '@angular/core';
import { Vehicle } from '../vehicle.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SiteDataModel } from '../../sites-list/site.model';
import { SiteService } from 'src/app/sites-list/sitesList.service';

@Component({
  selector: 'dialog-modal',
  templateUrl: './vehicle-modal.html',
  styleUrls: ['./vehicle-modal.component.less'],
})
export class VehicleModal implements OnInit {

  public modalVehicle: Vehicle;

  public vehicleForm: FormGroup;

  public sites: SiteDataModel[] = [];

  public siteVehicle: SiteDataModel = new SiteDataModel();

  vehicleBrandList = ['Acura', 'Alfa-Romeo', 'Aston Martin', 'Audi', 'BMW', 'Bentley', 'Bugatti', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Citroen', 'Daewoo', 'Daihatsu',
    'Dodge', 'Eagle', 'Ferrari', 'Fiat', 'Fisker', 'Ford', 'Freighliner', 'GMC - General Motors Company', 'Genesis', 'Geo', 'Honda', 'Hummer', 'Hyundai',
    'Infinity', 'Isuzu', 'Iveco', 'Jaguar', 'Jeep', 'Kla', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Mazda', 'Maserati', 'Maybach',
    'McLaren', 'Mercedez-Benz', 'Mercury', 'Mini', 'Mitsubishi', 'Nissan', 'Oldsmobile', 'Opel', 'Panoz', 'Peugeot', 'Plymouth', 'Polestar', 'Pontiac',
    'Porsche', 'Ram', 'Renault', 'Rivian', 'Rolls_Royce', 'Saab', 'Saturn', 'Smart', 'Subaru', 'Susuki', 'Tesla', 'Toyota', 'Volkswagen',
    'Volvo'];

  constructor(
    private dialogRef: MatDialogRef<VehicleModal>,
    private fb: FormBuilder,
    private siteService: SiteService,
    @Inject(MAT_DIALOG_DATA) public data: {
      isReadOnly: boolean;
      mode: string;
      vehicle: Vehicle;
      lastImmatriculation: string;
    }) {
    this.vehicleForm = this.fb.group({
      immatriculation: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
      site: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
      type: new FormControl({ value: '', disabled: this.isReadMode() }),
      libelle: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
      model: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
      flagService: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
      state: new FormControl({ value: '', disabled: this.isReadMode() }),
      kilometrage: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
      gas: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
    });
  }

  public ngOnInit(): void {

    this.modalVehicle = this.data.vehicle;

    this.siteService.getSitesAvailable().subscribe(sites => {
      this.sites = sites;
    });

    if (this.data.vehicle) {
      // On alimente le formgroup avec les valeurs du véhicule
      this.vehicleForm.controls['immatriculation'].setValue(this.data.vehicle.immatriculation);
      this.vehicleForm.controls['type'].setValue(this.data.vehicle.type);
      this.vehicleForm.controls['libelle'].setValue(this.data.vehicle.libelle);
      this.vehicleForm.controls['model'].setValue(this.data.vehicle.model);
      this.vehicleForm.controls['flagService'].setValue(this.data.vehicle.flagService);
      this.vehicleForm.controls['state'].setValue(this.data.vehicle.state);
      this.vehicleForm.controls['site'].setValue(this.data.vehicle.site.label);
      this.vehicleForm.controls['kilometrage'].setValue(this.data.vehicle.killometrageVehicle);
      this.vehicleForm.controls['gas'].setValue(this.data.vehicle.essenceVehicule);
    }
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
   * Détermine l'état du bouton de sauvegarde
   */
  public isSaveDisabled(): boolean {
    return this.vehicleForm.touched && this.vehicleForm.valid;

  }

  public close(saved: boolean = false): void {
    const vehicle: Vehicle = new Vehicle();

    if (saved) {
      vehicle.immatriculation = this.vehicleForm.controls['immatriculation'].value;
      vehicle.model = this.vehicleForm.controls['model'].value;
      vehicle.libelle = this.vehicleForm.controls['libelle'].value;
      vehicle.type = this.vehicleForm.controls['type'].value;
      vehicle.flagService = this.vehicleForm.controls['flagService'].value;
      vehicle.state = this.vehicleForm.controls['state'].value;
      vehicle.killometrageVehicle = this.vehicleForm.controls['kilometrage'].value;
      vehicle.essenceVehicule = this.vehicleForm.controls['gas'].value;
      vehicle.site = this.siteVehicle;
      vehicle.type = 1;
      vehicle.flagService = false;
    }
    this.dialogRef.close({ saved: saved, vehicle: vehicle, mode: this.data.mode, lastImmatriculation: this.data.lastImmatriculation });
  }

  public setParkingSite(status: MatOptionSelectionChange, site: SiteDataModel): void {
    if (status.isUserInput) {
      this.siteVehicle = site;
    }
  }

}
