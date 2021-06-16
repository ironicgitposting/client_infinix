import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../users-list/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../users-list/usersList.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { LoanDataModel } from '../loan.data.model';
import { SiteDataModel } from '../../sites-list/site.model';
import { StatusModel } from '../../common/models/StatusModel';

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

  public selectedDriver: User = new User();

  public selectedSite: SiteDataModel = new SiteDataModel();

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoanModalComponent>,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public data: {
              isReadOnly: boolean;
              mode: string;
              loan: LoanDataModel;
  }) {
      this.loanForm = this.fb.group({
      driver: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      departureSite: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      start: new FormControl({value: '', disabled: this.isReadMode()}, [Validators.required]),
      end: new FormControl({value: '', disabled: this.isReadMode()}, []),
      acceptPassengers: new FormControl({value: '', disabled: this.isReadMode()}, [])
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.drivers = users;
    });
    if (this.data.loan) {
      // On alimente le formgroup avec les valeurs de la réservation
      this.loanForm.controls['driver'].setValue(this.data.loan.driver.surname + ' ' + this.data.loan.driver.name);
      this.loanForm.controls['departureSite'].setValue(this.data.loan.site.label);
      this.loanForm.controls['start'].setValue(this.data.loan.startDate);
      this.loanForm.controls['end'].setValue(this.data.loan.endDate);
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
   * Sinon alimente l'objet loan et l'envoi au composant parent pour sauvegarde
   * @param saved On sauvegarde ou non
   */
  public close(saved: boolean = false): void {
    const loan: LoanDataModel = new LoanDataModel();
    if (saved) {
      loan.driver = new User();
      loan.driver.id = this.selectedDriver.id;
      loan.site = new SiteDataModel();
      loan.site.id = this.selectedSite.id || 1;
      loan.startDate = this.loanForm.controls['start'].value.toDate();
      if (this.loanForm.controls['end'].value !== '') {
        loan.endDate = this.loanForm.controls['end'].value.toDate();
      }
      loan.status = new StatusModel();
      loan.status.id = 1;
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
  public setSite(status: MatOptionSelectionChange, site: SiteDataModel): void {
    if (status.isUserInput) {
      this.selectedSite = site;
    }
  }
}
