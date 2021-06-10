import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from "../vehicle.model";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LoanService } from "../../loan/loan.service";
import { LoanDataModel } from "../../loan/loan.data.model";

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
    selector: 'dialog-modal',
    templateUrl: './historicalVehicleModal.html',
    styleUrls: ['../vehicles-list.component.less'],
    animations: [
      trigger('detailExpand', [
        state('collapsed, void', style({ height: '0px' })),
        state('expanded', style({ height: '*' })),
        transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        transition('expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')) ]),
  ]
  })
  export class HistoricalVehicleModal implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    
    public modalVehicle : Vehicle;
    
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

    dataSource: MatTableDataSource<LoanDataModel>;
    
    status = ['Tous', 'En attente de validation', 'Validé', 'En cours', 'En retard', 'Clôturé'];

    constructor(
      private dialogRef: MatDialogRef<HistoricalVehicleModal>,
      private loanService: LoanService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ){}
  
    ngOnInit(){
      this.modalVehicle = this.data.vehicle;
      if (this.data.vehicle) {
        this.fetchData(this.modalVehicle.id);
      }
    }
    
    onNoClick(): void {
      this.dialogRef.close();
    }

    fetchData(id: number) {
      
      this.loanService.getAllLoansForVehicle(id).subscribe(bookings => {
        this.ELEMENT_DATA = bookings;
        console.log(this.ELEMENT_DATA);
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        console.log(this.dataSource);
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
}