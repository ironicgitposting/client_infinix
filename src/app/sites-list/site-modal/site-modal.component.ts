import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SiteDataModel } from '../site.model';

@Component({
  selector: 'app-site-modal',
  templateUrl: './site-modal.component.html',
  styleUrls: ['./site-modal.component.less'],
})
export class SiteModalComponent implements OnInit {

  public siteForm: FormGroup;

  public sites: any[] = [];

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<SiteModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                isReadOnly: boolean;
                mode: string;
                site: any;
              }) {
    this.siteForm = this.fb.group({
      label: new FormControl({ value: '', disabled: this.isReadMode() }, Validators.required),
      adress: new FormControl({ value: '', disabled: true }, Validators.required),
      postalCode: new FormControl({ value: '', disabled: true }, Validators.required),
      city: new FormControl({ value: '', disabled: true }, [Validators.required]),
      phone: new FormControl({ value: '', disabled: this.isReadMode() }, []),
      mail: new FormControl({ value: '', disabled: this.isReadMode() }, [Validators.required, Validators.email]),
      pays: new FormControl({ value: '', disabled: true }, []),
    });
  }

  public ngOnInit(): void {
    if (this.data.site) {
      // On alimente le formgroup avec les valeurs du site
      this.siteForm.controls['label'].setValue(this.data?.site?.label);
      this.siteForm.controls['adress'].setValue(this.data?.site?.adress);
      this.siteForm.controls['postalCode'].setValue(this.data?.site?.postalCode);
      this.siteForm.controls['city'].setValue(this.data?.site?.city);
      this.siteForm.controls['phone'].setValue(this.data?.site?.phone);
      this.siteForm.controls['mail'].setValue(this.data?.site?.mail);
      this.siteForm.controls['pays'].setValue(this.data?.site?.pays);
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
   * Ferme la modale sans enregistrer si on ferme depuis Annuler ou la croix
   * Sinon alimente l'objet site et l'envoi au composant parent pour sauvegarde
   * @param saved On sauvegarde ou non
   */
  public close(saved: boolean = false): void {
    const site: SiteDataModel = new SiteDataModel();
    debugger;
    if (!this.siteForm.valid) {
      this.dialogRef.close();
      return;
    }
    if (saved && this.siteForm.valid) {
      site.label = this.siteForm.controls['label'].value;
      site.adress = this.siteForm.controls['adress'].value;
      site.postalCode = this.siteForm.controls['postalCode'].value;
      site.city = this.siteForm.controls['city'].value;
      site.phone = this.siteForm.controls['phone'].value;
      site.mail = this.siteForm.controls['mail'].value;
      site.pays = this.siteForm.controls['pays'].value;
      site.latitude = this.data?.site?.latitude;
      site.longitude = this.data?.site?.longitude;
    }
    this.dialogRef.close({ saved, site });
  }

  /**
   * Détermine l'état du bouton de sauvegarde
   */
  public isSaveDisabled(): boolean {
    return this.siteForm.touched && this.siteForm.valid;
  }
}
