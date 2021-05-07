import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../users-list/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../users-list/usersList.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SiteDataModel } from '../site.data.model';

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
  }) {
      this.siteForm = this.fb.group({
      driver: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      departureSite: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      start: new FormControl({value: '', disabled: this.isReadMode()}, [Validators.required]),
      end: new FormControl({value: '', disabled: this.isReadMode()}, []),
      acceptPassengers: new FormControl({value: '', disabled: this.isReadMode()}, [])
    });
  }

  ngOnInit(): void {
    this.userService.getUsers();
    this.usersSub = this.userService.getUserUpdateListener()
      .subscribe((userData: {users: User[]}) => {
        this.drivers = userData.users;
      });
    if (this.data.site) {
      // On alimente le formgroup avec les valeurs de la réservation
      this.siteForm.controls['driver'].setValue(this.data.site.User.surname + ' ' + this.data.site.User.name);
      this.siteForm.controls['departureSite'].setValue(this.data.site.Site.label);
      this.siteForm.controls['start'].setValue(this.data.site.startDate);
      this.siteForm.controls['end'].setValue(this.data.site.endDate);
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
    const site: SiteDataModel = {};
    if (saved) {
      site.driver = this.driverId;
      site.departureSite = this.siteId;
      site.lentVehicule = null;
      site.startDate = this.siteForm.controls['start'].value.toDate();
      if (this.siteForm.controls['end'].value !== '') {
        site.endDate = this.siteForm.controls['end'].value.toDate();
      } else {
        site.endDate = null;
      }
      site.status = 1;
    }
    this.dialogRef.close({ saved: saved, site: site });
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
