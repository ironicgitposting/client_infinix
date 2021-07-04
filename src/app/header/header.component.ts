import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../users-list/user.model';
import * as moment from 'moment';
import { Device } from '../common/device'
import { LoanService } from '../loan/loan.service';
import { LoanDataModel } from '../loan/loan.data.model';
import { MatDialog } from '@angular/material/dialog';
import { LoanInProgressComponent } from './loan-in-progress/loan-in-progress.component';
import { LoanUserComponent } from './loan-user/loan-user.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  /**
   * Nom de la page affichée, par défaut = Tableau de bord
   */
  @Input() pageName: string = 'Tableau de bord';
  /**
   * Utilisateur connecté
   */
  @Input() connectedUser: User;

  public userProfile: string;

  public notificationCount: number =0;

  public notificationCountBookingUser: number =0;

  public rowsBookingsUser: any[];

  public rowsBookingsValider: any[];

    public notificationCountStatutEnAttenteDeValidation: number =0;

  public notificationCountStatutValide: number =0;



  /**
   * Date du jour au format string
   */
  public today: string = moment().locale('fr').format('dddd Do MMMM YYYY');
  sort: any;
  dialog: any;

  constructor(
    private authenticationService: AuthenticationService,
    public loanService: LoanService,
    public dialog2: MatDialog,
    @Inject(LOCALE_ID) public locale: string
  ) { }
  /**
     * Déconnexion
     */

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
      this.rowsBookingsUser = loan.notificationCountBookingUser.rows;
     });


  }

  public logout(): void {
    this.authenticationService.logout();
  }

  /**
   * Ouverture de la modale de réservation
   * @param isReadOnly En lecture seule ou non
   * @param mode Mode d'ouverture => Création / modification
   * @param loan
   */
   public openLoanInProgress(mode: string, loan: LoanDataModel | null): void {
    const dialogRef = this.dialog2.open(LoanInProgressComponent, {
      data: { mode: mode, loan: loan }
    });
  }

  public openLoanUser(mode: string, loan: LoanDataModel | null): void {
    const dialogRef = this.dialog2.open(LoanUserComponent, {
      data: { mode: mode, loan: loan }
    });
  }

  IsMobile(){
    Device.definedUseDevice('header-container');
    return Device.isMobileDevice();
  }

}

