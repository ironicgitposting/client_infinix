import { Component, Inject, OnInit } from '@angular/core';
import { Vehicle } from '../vehicle.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SiteDataModel } from '../../sites-list/site.model';

@Component({
  selector: 'dialog-modal',
  templateUrl: './vehicle-modal.html',
  styleUrls: ['./vehicle-modal.component.less'],
})
export class VehicleModal implements OnInit {

  public modalVehicle: Vehicle;

  public vehicleForm: FormGroup;

  public sites: SiteDataModel[] = [];

  public siteId: number;

  types = ['En validation', 'Validé', 'En cours', 'En retard', 'Clôturé'];

  constructor(
    private dialogRef: MatDialogRef<VehicleModal>,
    private fb: FormBuilder,
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
      state: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
    });
  }

  ngOnInit() {
    this.modalVehicle = this.data.vehicle;
    if (this.data.vehicle) {
      // On alimente le formgroup avec les valeurs du véhicule
      this.vehicleForm.controls['immatriculation'].setValue(this.data.vehicle.immatriculation);
      this.vehicleForm.controls['type'].setValue(this.data.vehicle.type);
      this.vehicleForm.controls['libelle'].setValue(this.data.vehicle.libelle);
      this.vehicleForm.controls['model'].setValue(this.data.vehicle.model);
      this.vehicleForm.controls['flagService'].setValue(this.data.vehicle.flagService);
      this.vehicleForm.controls['state'].setValue(this.data.vehicle.state);
      this.vehicleForm.controls['site'].setValue(this.data.vehicle.site.label);
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
      // FIXME: Changer ça quand la partie back des sites sera faite
      vehicle.site = new SiteDataModel();
      vehicle.site.id = 1;
      vehicle.flagService = false;
    }
    this.dialogRef.close({ saved: saved, vehicle: vehicle, mode: this.data.mode, lastImmatriculation: this.data.lastImmatriculation });
  }

  public setSiteId(status: MatOptionSelectionChange, site: SiteDataModel): void {
    if (status.isUserInput) {
      this.siteId = site.id;
    }
  }

}
