import { ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Site } from "./site.model";
import { SiteService } from "./sitesList.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
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
      state('collapsed', style({ height: '0px', minHeight:'0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')) ]),
],
})
export class SitesListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  sites: Site[] = [];
  private sitesSub: Subscription;

  ELEMENT_DATA : Site[];
  columnsToDisplay: string[] = ['label', 'adress', 'postalCode', 'city', 'phone', 'mail', 'pays'];

  columnsName: {
    [model : string]: string;
    label: string;
    adress: string;
    postalCode: string;
    city: string;
    phone:string;
    mail:string;
    pays:string;
  } = {
    label: 'Nom',
    adress: 'Adresse',
    postalCode: 'Code Postal',
    city: 'Ville',
    phone: 'Télephone',
    mail:'Email',
    pays:'Pays'
  };

  expandedElement: Site | null;

  etats = ['En validation', 'Validé', 'En cours', 'En retard', 'Clôturé']

  dataSource: MatTableDataSource<any>;


  constructor(private siteService: SiteService, public dialog: MatDialog) {

  }

  public openSiteModal(mode: string, site: Site | null): void {
    const dialogRef = this.dialog.open(SiteModalComponent, {
      data: { mode: mode, site: site }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.saved) {
        this.siteService.createSite(result.site).subscribe(response => {
          console.log(response);
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
    this.siteService.getSites().subscribe(site => {
      this.ELEMENT_DATA = site.sites;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
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

  openDialog(site: Site): void {
    const dialogRef = this.dialog.open(DialogSite, {
      data: {
        site
      }
    });
  }

  deleteSite(site: Site): void {
    if (site.label) {
      this.siteService.deleteSite(site);
    }
  }

  onSiteSwitchToggle($event: MatSlideToggleChange, site: Site): void {
    this.siteService.updateSite(site);
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

  public modalSite: Site;

  constructor(
    private siteService: SiteService,
    public dialogRef: MatDialogRef<DialogSite>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.modalSite = this.data.site;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(ngForm: NgForm) {

    if (ngForm.valid) {
      const newSite: Site = {
        label: ngForm.form.value.label,
        adress: ngForm.form.value.adress,
        postalCode: ngForm.form.value.postalCode,
        city: ngForm.form.value.city,
        pays: ngForm.form.value.pays
        // TODO: A COMPLETER

      }
      console.log(ngForm);
      this.siteService.updateSite(newSite);
      this.router.navigate(['/sites']);

    }

  }
}
