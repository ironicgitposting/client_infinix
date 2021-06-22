import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../users-list/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../users-list/usersList.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SiteDataModel } from '../site.model';

@Component({
  selector: 'app-site-modal',
  templateUrl: './site-modal.component.html',
  styleUrls: ['./site-modal.component.less']
})
export class SiteModalComponent implements OnInit {

  public siteForm: FormGroup;

  public drivers: User[] = [];

  public sites: any[] = [];

  private usersSub: Subscription;

  public driverId: number | undefined = 1;

  public siteId: number | undefined = 1;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<SiteModalComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: {
              isReadOnly: boolean;
              mode: string;
              site: any;
              //lastLabel: string;
  }) {
      this.siteForm = this.fb.group({
      label: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      adress: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      postalCode: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      city: new FormControl({value: '', disabled: this.isReadMode()}, [Validators.required]),
      phone: new FormControl({value: '', disabled: this.isReadMode()}, []),
      mail: new FormControl({value: '', disabled: this.isReadMode()}, [Validators.required]),
      pays: new FormControl({value: '', disabled: this.isReadMode()}, [])
    });
  }

  ngOnInit(): void {
    if (this.data.site) {

      console.log("this.data.site : ", this.data.site);
      // On alimente le formgroup avec les valeurs de la réservation
      this.siteForm.controls['label'].setValue(this.data.site.label);
      this.siteForm.controls['adress'].setValue(this.data.site.adress);
      this.siteForm.controls['postalCode'].setValue(this.data.site.postalCode);
      this.siteForm.controls['city'].setValue(this.data.site.city);
      this.siteForm.controls['phone'].setValue(this.data.site.phone);
      this.siteForm.controls['mail'].setValue(this.data.site.mail);
      this.siteForm.controls['pays'].setValue(this.data.site.pays);
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
    if(!this.siteForm.valid){
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
    }
    this.dialogRef.close({ saved: saved, site: site});
  }

  /**
   * Détermine l'état du bouton de sauvegarde
   */
  public isSaveDisabled(): boolean {
    return this.siteForm.touched && this.siteForm.valid;
  }

  /**
   * On récupère l'id du choix car le matSelect ne contient pas l'objet mais que du texte
   * @param status Evènement du matSelect pour qu'il ne se déclenche qu'une fois
   * @param driver Conducteur choisi
   */
  public setDriverId(status: MatOptionSelectionChange, driver: any): void {
    if (status.isUserInput) {
      this.driverId = driver.id;
    }
  }

  /**
   * On récupère l'id du choix car le matSelect ne contient pas l'objet mais que du texte
   * @param status Evènement du matSelect pour qu'il ne se déclenche qu'une fois
   * @param site Site choisi
   */
  public setSiteId(status: MatOptionSelectionChange, site: any): void {
    if (status.isUserInput) {
      this.siteId = site.id;
    }
  }
}
