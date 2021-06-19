import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { LoanModalComponent } from './loan-modal/loan-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MessageService } from '../common/services/message.service';
import { LoanService } from './loan.service';
import { LoanDataModel } from './loan.data.model';
import { StatusModel } from '../common/models/StatusModel';
import { StatusService } from '../common/services/status.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { StatusEnum } from '../common/models/status.enum';
import { AuthenticationService } from '../authentication/authentication.service';
import { FamilyStatusEnum } from '../common/models/familyStatus.enum';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.less'],
    animations: [
      trigger('detailExpand', [
        state('collapsed, void', style({ height: '0px' })),
        state('expanded', style({ height: '*' })),
        transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        transition('expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')) ]),
  ],
})
export class LoanComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  public loans: LoanDataModel[] = [];

  /**
   * FormGroup des filtres
   */
  public filterForm: FormGroup;

  public columnsToDisplay: string[] = ['status', 'driver', 'departureSite', 'arrivalSite', 'startDate', 'endDate', 'actions'];

  public columsName: {
    [status: string]: string;
    driver: string;
    departureSite: string;
    arrivalSite: string;
    startDate: string;
    endDate: string; } = {
    status: 'Statut',
    driver: 'Conducteur',
    departureSite: 'site de départ',
    arrivalSite: 'site d\'arrivé',
    startDate: 'Date du prêt',
    endDate: 'Date de rendu'};

  public expandedElement: LoanDataModel | null;

  public status: StatusModel[] = [];

  public dataSource: MatTableDataSource<any>;

  public filters: {search: string, start: Date, end: Date};

  public isAdmin: boolean = false;

  constructor(public dialog: MatDialog,
              private msgService: MessageService,
              private loanService: LoanService,
              private statusService: StatusService,
              private fb: FormBuilder,
              private authService: AuthenticationService,
  ) {
    this.isAdmin = this.authService.getIsAdmin();
    this.filterForm = this.fb.group({
      search: new FormControl('', []),
      start: new FormControl('', []),
      end: new FormControl('', []),
      status: new FormControl('Tous', [])
    });
  }

  public ngOnInit(): void {
    const localStorageUser: string = localStorage.getItem('connectedUser') || '';
    const connectedUser = JSON.parse(localStorageUser);
    this.loanService.getAllLoans(connectedUser).subscribe(loan => {
      this.loans = loan;
      this.dataSource = new MatTableDataSource(this.loans);
      this.dataSource.filterPredicate = (data, filters: string)  => {
        let ret: boolean = false;
        let retDate: boolean = false;
        let retStatus: boolean = false;
        const filterArray = filters.split('¤');
        if (filterArray[0] && filterArray[0].split('|')[0] !== '') {
          const accumulator = (currentTerm: any, key: any) => {
            return this.nestedFilterCheck(currentTerm, data, key);
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          ret = dataStr.indexOf(filterArray[0].split('|')[0]) !== -1;
        } else {
          ret = true;
        }
        if (filterArray[1] && filterArray[1].split('|')[0] !== '' || filterArray[2] && filterArray[2].split('|')[0] !== '') {
          if (this.filterForm.controls['start'].value && this.filterForm.controls['end'].value) {
            if (data.endDate) {
              retDate = this.filterForm.controls['end'].value.toDate().getTime() >= moment(data.endDate).toDate().getTime() &&
                this.filterForm.controls['start'].value.toDate().getTime() <= moment(data.startDate).toDate().getTime();
            } else {
              retDate = this.filterForm.controls['start'].value.toDate().getTime() <= moment(data.startDate).toDate().getTime();
            }
          } else if (this.filterForm.controls['start'].value &&
                    (!this.filterForm.controls['end'].value ||
                    this.filterForm.controls['end'].value === '')) {
            retDate = this.filterForm.controls['start'].value.toDate().getTime() <= moment(data.startDate).toDate().getTime();
          } else if (this.filterForm.controls['end'].value &&
                    (!this.filterForm.controls['start'].value ||
                    this.filterForm.controls['start'].value === '')) {
            if (data.endDate) {
              retDate = this.filterForm.controls['end'].value.toDate().getTime() >= moment(data.endDate).toDate().getTime();
            } else {
              retDate = true;
            }
          } else {
            retDate = true;
          }
        } else {
          retDate = true;
        }
        if (filterArray[3] && filterArray[3] !== '' && filterArray[3] !== 'Tous') {
          retStatus = data.status.label === filterArray[3];
        } else {
          retStatus = true;
        }
        return [ret, retDate, retStatus].every(Boolean);
      };

      this.dataSource.sort = this.sort;
    });
    this.statusService.getStatusByFamilyStatus(FamilyStatusEnum.bookingsFamily).subscribe(status => {
      const statusAll: StatusModel = new StatusModel();
      statusAll.label = 'Tous';
      this.status.push(statusAll);
      status.forEach(stat => {
        this.status.push(stat);
      });
    });
  }

  public nestedFilterCheck(search: any, data: any, key: any): any {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else if (key !== 'startDate' && key !== 'endDate') {
      search += data[key];
    }
    return search;
  }

  /**
   * Applique le filtre saisie
   * @param event
   */
  public applySearchFilter(event: Event): void {
    this.dataSource.filter = `${this.filterForm.controls['search'].value}|true¤${this.filterForm.controls['start'].value?.toString()}|¤${this.filterForm.controls['end'].value?.toString()}|¤${this.filterForm.controls['status'].value?.toString()}`;
  }

  /**
   * Applique le filtre saisie
   * @param event
   */
  public applyDateFilter(event: MatDatepickerInputEvent<any>): void {
    const elementName: string | null = (event.targetElement as HTMLInputElement).getAttribute('formcontrolname');
    if (elementName && elementName === 'start') {
      this.dataSource.filter = `${this.filterForm.controls['search'].value}|¤${this.filterForm.controls['start'].value?.toString()}|true¤${this.filterForm.controls['end'].value?.toString()}|¤${this.filterForm.controls['status'].value?.toString()}`;
    } else if (elementName && elementName === 'end') {
      this.dataSource.filter = `${this.filterForm.controls['search'].value}|¤${this.filterForm.controls['start'].value?.toString()}|¤${this.filterForm.controls['end'].value?.toString()}|true¤${this.filterForm.controls['status'].value?.toString()}`;
    }
  }

  /**
   * Ouverture de la modale de réservation
   * @param isReadOnly En lecture seule ou non
   * @param mode Mode d'ouverture
   * @param loan
   */
  public openLoanModal(mode: string, loan: LoanDataModel | null): void {
    const dialogRef = this.dialog.open(LoanModalComponent, {
      data: { mode: mode, loan: loan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.saved) {
        this.loanService.createLoan(result.loan).subscribe(response => {
          this.msgService.snackbar('Demande de réservation enregistrée', 'success');
          this.loans.push(result.loan);
          this.dataSource = new MatTableDataSource(this.loans);
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  /**
   * Filtrer le tableau par la colonne statut
   * @param status
   */
  public filterByStatus(status: MatOptionSelectionChange): void {
    if (status.isUserInput) {
      if (status.source.value === 'Tous') {
        this.dataSource.filter = `${this.filterForm.controls['search'].value}|¤${this.filterForm.controls['start'].value?.toString()}|¤${this.filterForm.controls['end'].value?.toString()}|¤Tous`;
      } else {
        this.dataSource.filter = `${this.filterForm.controls['search'].value}|¤${this.filterForm.controls['start'].value?.toString()}|¤${this.filterForm.controls['end'].value?.toString()}|¤${status.source.value}`;
      }
    }
  }

  /**
   * Clôture du prêt
   * @param loan Prêt à clôturer
   */
  public closeLoan(loan: LoanDataModel): void {
    this.msgService.confirm('Êtes-vous sûr(e) de vouloir clôturer cette réservation ?').subscribe(response => {
      if (response) {
        loan.status.id = 3;
        loan.status.label = StatusEnum.ended;
        this.loanService.updateLoan(loan).subscribe(res => {
          this.msgService.snackbar('Réservation clôturée');
        });
      }
    });
  }

  /**
   * Annulation du prêt
   * @param loan Prêt à annuler
   */
  public cancelLoan(loan: LoanDataModel): void {
    this.msgService.confirm('Êtes-vous sûr(e) de vouloir annuler cette réservation ?').subscribe(response => {
      if (response) {
        loan.status.id = 6;
        loan.status.label = StatusEnum.canceled;
        this.loanService.updateLoan(loan).subscribe(res => {
          this.msgService.snackbar('Réservation annulée');
        });
      }
    });
  }

  /**
   * Ouvre la modal du prêt en mode validation
   * @param loan Prêt à valider
   */
  public validateLoan(loan: LoanDataModel): void {
    const dialogRef = this.dialog.open(LoanModalComponent, {
      data: { mode: 'validate', loan: loan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.saved) {
        result.loan.status.id = 4;
        result.loan.status.label = StatusEnum.validated;
        this.loanService.updateLoan(result.loan).subscribe(response => {
          this.msgService.snackbar('Réservation validée');
          this.loans.forEach(loan => {
            if (loan.id === result.loan.id) {
              this.loans[this.loans.indexOf(loan)] = result.loan;
            }
          });
          this.dataSource = new MatTableDataSource(this.loans);
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  /**
   * Ouvre la modale de modification d'un prêt
   * @param loan Prêt à modifier
   */
  public updateLoan(loan: LoanDataModel): void {
    const dialogRef = this.dialog.open(LoanModalComponent, {
      data: { mode: 'update', loan: loan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.saved) {
        this.loanService.updateLoan(result.loan).subscribe(response => {
          this.msgService.snackbar('Modification de la réservation enregistrée');
          this.loans.forEach(loan => {
            if (loan.id === result.loan.id) {
              this.loans[this.loans.indexOf(loan)] = result.loan;
            }
          });
          this.dataSource = new MatTableDataSource(this.loans);
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  /**
   * Retourne la date de fin du filtre
   */
  public getMaxDate(): Date | string {
    if (this.filterForm.controls['end'].value !== '' && this.filterForm.controls['end'].value) {
      return this.filterForm.controls['end'].value.toDate();
    }
    return '';
  }

  /**
   * Retourne la date de début du filtre
   */
  public getMinDate(): Date | string {
    if (this.filterForm.controls['start'].value !== '' && this.filterForm.controls['start'].value) {
      return this.filterForm.controls['start'].value.toDate();
    }
    return '';
  }

  /**
   * Retourne la valeur par défaut à afficher dans le select des états
   */
  public getDefaultSelectValue(): string {
    if (this.status.length > 0 && this.status[0].label) {
      return this.status[0].label;
    }
    return '';
  }

  /**
   * Gestion des états des boutons
   */

  /**
   * Affiche ou non le bouton pour clôturer la réservation
   * @param loan Réservation
   */
  public isEndDatePassed(loan: LoanDataModel): boolean {
    let ret: boolean = false;
    if (loan && loan.endDate) {
      if (new Date(loan.endDate) < new Date()) {
        ret = true;
      }
    }
    return ret;
  }

  /**
   * Est-ce que le prêt est actif
   * @param loan Réservation
   */
  public isLoanActive(loan: LoanDataModel): boolean {
    let ret: boolean = false;
    if (loan && loan.startDate) {
      if (new Date(loan.startDate) < new Date()) {
        ret = true;
      }
    }
    return ret;
  }

  /**
   * Est-ce que le prêt est en cours
   * @param loan Réservation
   */
  public isLoanRunning(loan: LoanDataModel): boolean {
    let ret: boolean = false;
    if (loan.status.label === StatusEnum.running) {
      ret = true;
    }
    return ret;
  }

  /**
   * Est-ce que le prêt est en attente de validation
   * @param loan Réservation
   */
  public isAwaitingValidation(loan: LoanDataModel): boolean {
    let ret: boolean = false;
    if (loan.status.label === StatusEnum.awaitingValidation) {
      ret = true;
    }
    return ret;
  }

  /**
   * Est-ce que le prêt est validé
   * @param loan Réservation
   */
  public isLoanValidated(loan: LoanDataModel): boolean {
    let ret: boolean = false;
    if (loan.status.label === StatusEnum.validated) {
      ret = true;
    }
    return ret;
  }

  /**
   * Est-ce que le prêt est annulé
   * @param loan Réservation
   */
  public isLoanCanceled(loan: LoanDataModel): boolean {
    let ret: boolean = false;
    if (loan.status.label === StatusEnum.canceled) {
      ret = true;
    }
    return ret;
  }

  /**
   * Est-ce que le bouton de modification est actif
   * @param loan Réservation
   */
  public isUpdateButtonActive(loan: LoanDataModel): boolean {
    return !this.isLoanActive(loan) && !this.isLoanValidated(loan) && !this.isLoanCanceled(loan);
  }

  /**
   * Est-ce que le bouton de consultation est actif
   * @param loan Réservation
   */
  public isReadButtonActive(loan: LoanDataModel): boolean {
    return !this.isUpdateButtonActive(loan);
  }

  /**
   * Est-ce que le bouton de clôture est actif
   * @param loan Réservation
   */
  public isCloseLoanButtonActive(loan: LoanDataModel): boolean {
    return !this.isEndDatePassed(loan) && this.isLoanActive(loan) && this.isLoanRunning(loan);
  }

  /**
   * Est-ce que le bouton d'annulation est actif
   * @param loan Réservation
   */
  public isCancelButtonActive(loan: LoanDataModel): boolean {
    return (this.isAwaitingValidation(loan) || this.isLoanValidated(loan)) && !this.isEndDatePassed(loan) && !this.isLoanActive(loan);
  }
}
