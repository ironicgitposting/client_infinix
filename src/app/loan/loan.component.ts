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
  ELEMENT_DATA = [
    {
      start: 1,
      status: 'En cours',
      driver: 'Jules Corentin',
      site: 'H'
    }, {
      start: 2,
      status: 'Clôturé',
      driver: 'Richard Patrick',
      site: 'He'
    }, {
      start: 3,
      status: 'En validation',
      driver: 'Menard Romain',
      site: 'Li'
    }, {
      start: 4,
      status: 'Validé',
      driver: 'Bedjaï Romain',
      site: 'Be'
    }, {
      start: 5,
      status: 'En retard',
      driver: 'Oujdari Mourad',
      site: 'B'
    }, {
      start: 6,
      status: 'En validation',
      driver: 'Dupont Jean',
      site: 'C'
    }, {
      start: 7,
      status: 'En cours',
      driver: 'Doe John',
      site: 'N'
    }, {
      start: 8,
      status: 'Validé',
      driver: 'Doe Jane',
      site: 'O'
    }, {
      start: 9,
      status: 'Validé',
      driver: 'Toto',
      site: 'F'
    }, {
      start: 10,
      status: 'Clôturé',
      driver: 'Tutu',
      site: 'Ne'
    },
  ];

  columnsToDisplay: string[] = ['status', 'driver', 'departureSite', 'startDate', 'endDate'];

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

  status = ['Tous', 'En validation', 'Validé', 'En cours', 'En retard', 'Clôturé'];

  dataSource: MatTableDataSource<any>;

  constructor(private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              private msgService: MessageService,
              private loanService: LoanService) {
  }

  public ngOnInit(): void {
    this.loanService.getAllLoans().subscribe(loan => {
      this.ELEMENT_DATA = loan.booking;
      console.log(this.ELEMENT_DATA);
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      console.log(this.dataSource);
      this.dataSource.sort = this.sort;
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public openSnackBar(type: string, message: string) {
    this.msgService.snackbar(message, type);
  }

  public openLoanModal(isReadOnly: boolean, mode: string, loan: LoanDataModel): void {
    const dialogRef = this.dialog.open(LoanModalComponent, {
      data: { isReadOnly: isReadOnly, mode: mode, loan: loan }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.saved) {
        this.loanService.createLoan(result.loan).subscribe(response => {
          console.log(response);
          this.openSnackBar('success', 'Demande de réservation enregistrée');
        });
      }
    });
  }

  public filterByStatus(status: MatOptionSelectionChange): void {
    if (status.isUserInput) {
      if (status.source.value === this.status[0]) {
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      } else {
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.filter(loan => loan.status === status.source.value));
      }
    }
  }
}
