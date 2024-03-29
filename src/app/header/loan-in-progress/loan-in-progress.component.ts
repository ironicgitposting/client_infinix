import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../users-list/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../../users-list/usersList.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SiteDataModel } from '../../sites-list/site.model';
import { StatusModel } from '../../common/models/StatusModel';
import { LoanDataModel } from 'src/app/loan/loan.data.model';
import { LoanService } from 'src/app/loan/loan.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-modal',
  templateUrl: './loan-in-progress.component.html',
  styleUrls: ['./loan-in-progress.component.less']
})
export class LoanInProgressComponent implements OnInit {

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
  /**
   * Utilisateur connecté
   */
  @Input() connectedUser: User;

  public notificationCountStatutEnAttenteDeValidation: number =0;

  public notificationCountStatutValide: number =0;

  public notificationCountBookingUser: number =0;

  public rowsBookingsUser: any[];

  public rowsBookingsValider: any[];

  public userProfile: string;

  @ViewChild(MatSort) sort: MatSort;

  ELEMENT_DATA: LoanDataModel[];

  columnsToDisplay: string[] = ['startDate'];

  columsName: {
    startDate: string; } = {
    startDate: 'Date du prêt'};

  expandedElement: LoanDataModel | null;

  status = ['Tous', 'En attente de validation', 'Validé', 'En cours', 'En retard', 'Clôturé'];

  dataSource: MatTableDataSource<any>;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoanInProgressComponent>,
              private userService: UserService,
              private loanService: LoanService,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: {
              isReadOnly: boolean;
              mode: string;
              loan: LoanDataModel;
  }) {
      this.loanForm = this.fb.group({
      startDate: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      driver: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      departureSite: new FormControl({value: '', disabled: this.isReadMode()}, Validators.required),
      start: new FormControl({value: '', disabled: this.isReadMode()}, [Validators.required]),
      end: new FormControl({value: '', disabled: this.isReadMode()}, []),
      acceptPassengers: new FormControl({value: '', disabled: this.isReadMode()}, [])
    });
  }

  ngOnInit(): void {
    const localStorageUser: string = localStorage.getItem('connectedUser') || '';
    this.connectedUser = JSON.parse(localStorageUser);
    if (!this.connectedUser.profile) {
      this.userProfile = 'Administrateur';
    }

    // Permet de donner le nombre de réservations avec le Status 'En attente de Validation'
    /* notificationCountStatutEnAttenteDeValidation */
     this.loanService.getLoansByStatus(1).subscribe(loan => {
      this.notificationCountStatutEnAttenteDeValidation = loan.notificationCount.count;
      this.rowsBookingsValider = loan.notificationCount.rows;
    });

    // Permet de donner le nombre de réservations avec le Status 'En attente de Validation'
    /* notificationCountStatutEnAttenteDeValidation */
     this.loanService.getLoansByStatus(4).subscribe(loan => {
      this.notificationCountStatutValide = loan.notificationCount.count;
      this.rowsBookingsValider = loan.notificationCount.rows;
    });


    // Permet de donner le nombre réservation avec le Status 'Validé' pour l'utilisateur connecté
    /* notificationCountBookingUser */
    this.loanService.getBookingsForUtilisateurStatusValide(this.connectedUser.id,4).subscribe(loan => {
      this.notificationCountBookingUser = loan.notificationCountBookingUser.count;

    // Permet de donner le contenu des réservations avec le Status 'Validé' pour l'utilisateur connecté
    /* rowsBookingsUser */
    this.rowsBookingsUser = loan.notificationCountBookingUser.rows;
       this.ELEMENT_DATA = loan;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
     });


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
    this.dialogRef.close();
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

  /**
   * Redirige vers la route passée en paramètre
   * @param target Nom de la route
   */
  public redirectTo(target: string, statusId:string) {
    this.router.navigate([`/${target}/${statusId}`]);
    this.dialogRef.close();
  }
}
