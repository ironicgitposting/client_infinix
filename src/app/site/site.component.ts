import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SiteModalComponent } from './site-modal/site-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MessageService } from '../common/services/message.service';
import { SiteService } from './site.service';
import { SiteDataModel } from './site.data.model';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.less'],
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
export class SiteComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  ELEMENT_DATA: SiteDataModel[];

  columnsToDisplay: string[] = ['status', 'driver', 'departureSite', 'startDate', 'endDate', 'actions'];

  columsName: {
    [status: string]: string;
    driver: string;
    departureSite: string;
    startDate: string;
    endDate: string; } = {
    status: 'Nom',
    driver: 'Adresse',
    departureSite: 'Code postal',
    startDate: 'Pays',
    endDate: 'Télephone'};

  expandedElement: SiteDataModel | null;

  status = ['Tous', 'En validation', 'Validé', 'En cours', 'En retard', 'Clôturé'];

  dataSource: MatTableDataSource<any>;

  constructor(private _snackBar: MatSnackBar,
              public dialog: MatDialog,
              private msgService: MessageService,
              private siteService: SiteService) {
  }

  public ngOnInit(): void {
    this.siteService.getAllSites().subscribe(site => {
      this.ELEMENT_DATA = site.booking;
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
   * @param site
   */
  public openSiteModal(mode: string, site: SiteDataModel | null): void {
    const dialogRef = this.dialog.open(SiteModalComponent, {
      data: { mode: mode, site: site }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.saved) {
        this.siteService.createSite(result.site).subscribe(response => {
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
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.filter(site => site.Status.label === status.source.value));
      }
    }
  }

  /**
   * Affiche ou non le bouton pour clôturer la réservation
   * @param site Réservation
   */
  public isEndDatePassed(site: SiteDataModel): boolean {
    let ret: boolean = false;
    if (site && site.endDate !== '' && site.endDate) {
      if (new Date(site.endDate) < new Date()) {
        ret = true;
      }
    }
    return ret;
  }

  /**
   * Affiche le bouton modifier ou consulter
   * @param site Réservation
   */
  public isSiteActive(site: SiteDataModel): boolean {
    let ret: boolean = false;
    if (site && site.startDate !== '' && site.startDate) {
      if (new Date(site.startDate) < new Date()) {
        ret = true;
      }
    }
    return ret;
  }
}
