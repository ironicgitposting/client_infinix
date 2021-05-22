import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoanModalComponent } from './loan-modal/loan-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MessageService } from '../common/services/message.service';
import { LoanService } from './loan.service';
import { LoanDataModel } from './loan.data.model';

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

  ELEMENT_DATA: LoanDataModel[];

  columnsToDisplay: string[] = ['status', 'driver', 'departureSite', 'startDate', 'endDate', 'actions'];

  columsName: {
    [status: string]: string;
    driver: string;
    departureSite: string;
    startDate: string;
    endDate: string; } = {
    status: 'Statut',
    driver: 'Conducteur',
    departureSite: 'site de départ',
    startDate: 'Date du prêt',
    endDate: 'Date de rendu'};

  expandedElement: LoanDataModel | null;

  status = ['Tous', 'En attente de validation', 'Validé', 'En cours', 'En retard', 'Clôturé'];

  dataSource: MatTableDataSource<any>;

  constructor(private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              private msgService: MessageService,
              private loanService: LoanService) {
  }

  public ngOnInit(): void {
    this.loanService.getAllLoans().subscribe(loan => {
      this.ELEMENT_DATA = loan;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Applique le filtre saisie
   * @param event
   */
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Ouverture de la modale de réservation
   * @param isReadOnly En lecture seule ou non
   * @param mode Mode d'ouverture => Création / modification
   * @param loan
   */
  public openLoanModal(mode: string, loan: LoanDataModel | null): void {
    const dialogRef = this.dialog.open(LoanModalComponent, {
      data: { mode: mode, loan: loan }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.saved) {
        this.loanService.createLoan(result.loan).subscribe(response => {
          console.log(response);
          this.msgService.snackbar('Demande de réservation enregistrée', 'success');
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
      if (status.source.value === this.status[0]) {
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      } else {
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.filter(loan => loan.status.label === status.source.value));
      }
    }
  }

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
   * Affiche le bouton modifier ou consulter
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
}
