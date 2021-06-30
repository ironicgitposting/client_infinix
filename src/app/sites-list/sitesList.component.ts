import { ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { SiteDataModel } from "./site.model";
import { SiteService } from "./sitesList.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { SiteModalComponent } from "./site-modal/site-modal.component";
import { MessageService } from "../common/services/message.service";
import { MatSort } from "@angular/material/sort";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: 'app-sites',
  templateUrl: './sitesList.component.html',
  styleUrls: ['./sitesList.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))]),
  ],
})
export class SitesListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  sites: SiteDataModel[] = [];
  private sitesSub: Subscription;

  ELEMENT_DATA: SiteDataModel[];
  columnsToDisplay: string[] = ['label', 'adress', 'postalCode', 'city', 'phone', 'mail', 'pays', 'action'];

  columnsName: {
    [model: string]: string;
    label: string;
    adress: string;
    postalCode: string;
    city: string;
    phone: string;
    mail: string;
    pays: string;
    action: string;
  } = {
      label: 'Nom',
      adress: 'Adresse',
      postalCode: 'Code Postal',
      city: 'Ville',
      phone: 'Télephone',
      mail: 'Email',
      pays: 'Pays',
      action: 'action',
    };

  expandedElement: SiteDataModel | null;

  etats = ['En validation', 'Validé', 'En cours', 'En retard', 'Clôturé']

  dataSource: MatTableDataSource<SiteDataModel>;


  constructor(private siteService: SiteService, public dialog: MatDialog, private msgService: MessageService) {

  }

  public openSiteModal(mode: string, site: SiteDataModel | null, lastLabel: string | null): void {
    const dialogRef = this.dialog.open(SiteModalComponent, {
      data: { mode: mode, site: site, lastLabel: lastLabel }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('mode', mode);
      debugger;

      if (result && result.saved && mode == 'new') {
        this.siteService.createSite(result.site).subscribe(response => {
          //this.msgService.snackbar('Site enregistré', 'success');
          this.fetchData();
          console.log(response);
        });
      } else if (result && result.saved && mode == 'update') {
        this.siteService.updateSite(result.site, lastLabel).subscribe(response => {
          this.msgService.snackbar('Véhicule modifié');
          this.fetchData();
        });
      }
    });
  }

  public ngOnInit() {
    /*this.siteService.getSites();
    this.sitesSub = this.siteService.getSiteUpdateListener()
      .subscribe((siteData: {sites: Site[]}) => {
        this.sites = siteData.sites;
      });*/
    this.siteService.getSitesAvailable().subscribe(site => {
      console.log(site);
      this.ELEMENT_DATA = site;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
    });

    this.fetchData();
  }

  fetchData() {
    this.siteService.getSitesAvailable().subscribe(site => {
      this.ELEMENT_DATA = site;
      console.log(this.ELEMENT_DATA);
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      console.log(this.dataSource);
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
  }

  public ngAfterViewInit() {

  }

  isEmptySites() {
    return this.sites.length == 0;
  }

  openDialog(site: SiteDataModel): void {
    const dialogRef = this.dialog.open(DialogSite, {
      data: {
        site
      }
    });
  }

  deleteSite(site: SiteDataModel): void {
    if (confirm('Are you sure to delete ')) {
      if (site.label) {
        this.siteService.deleteSite(site, site.id).subscribe(() => {
          this.fetchData();
        });
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: 'dialog-modal',
  templateUrl: './siteModal.html',
  styleUrls: ['./sitesList.component.less']
})
export class DialogSite implements OnInit {

  public modalSite: SiteDataModel;

  constructor(
    private siteService: SiteService,
    public dialogRef: MatDialogRef<DialogSite>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.modalSite = this.data.site;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(ngForm: NgForm) {

    if (ngForm.valid) {
      /*const newSite: SiteDataModel = {
        libelle: ngForm.form.value.libelle,
        adress: ngForm.form.value.adress,
        postalCode: ngForm.form.value.postalCode,
        city: ngForm.form.value.city,
        pays: ngForm.form.value.pays
        // TODO: A COMPLETER

      }*/
      console.log(ngForm);
      //this.siteService.updateSite(newSite);
      this.router.navigate(['/sites']);

    }

  }
}
