import { ViewChild } from "@angular/core";
import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { SiteDataModel } from "./site.model";
import { SiteService } from "./sitesList.service";
import { MatDialog } from '@angular/material/dialog';
import { SiteModalComponent } from "./site-modal/site-modal.component";
import { MessageService } from "../common/services/message.service";
import { MatSort } from "@angular/material/sort";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from 'rxjs';

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

  sites: SiteDataModel[];
  columnsToDisplay: string[] = ['label', 'adress', 'postalCode', 'city', 'pays', 'action'];

  columnsName: {
    [model: string]: string;
    label: string;
    adress: string;
    postalCode: string;
    city: string;
    pays: string;
    action: string;
  } = {
      label: 'Nom',
      adress: 'Adresse',
      postalCode: 'Code Postal',
      city: 'Ville',
      pays: 'Pays',
      action: 'action',
    };

  expandedElement: SiteDataModel | null;

  dataSource: MatTableDataSource<SiteDataModel>;

  coordinatesToMark: Subject<[[number, number]]> = new Subject<[[number, number]]>();

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

      if (result && result.saved && mode === 'new') {
        this.siteService.createSite(result.site).subscribe(response => {
          this.fetchData();
          console.log(response);
        });
      } else if (result && result.saved && mode === 'update') {
        this.siteService.updateSite(result.site, lastLabel).subscribe(response => {
          this.msgService.snackbar('Véhicule modifié');
          this.fetchData();
        });
      }
    });
  }

  public openSiteModalFromMap(mode: string, searchResult: any): void {
    console.log(searchResult);
    const placeInformations = searchResult.place_name.split(',');
    const site = new SiteDataModel();
    site.adress = placeInformations[0].trim();
    //TODO: se baser sur autre chose que le split du place_name
    site.postalCode = placeInformations[1].trim().split(' ')[0].trim();
    site.city = placeInformations[1].trim().split(' ')[1].trim();
    site.pays = placeInformations[2].trim();
    site.longitude = searchResult.center[0];
    site.latitude = searchResult.center[1];
    console.log(site);
    const dialogRef = this.dialog.open(SiteModalComponent, {
      data: { mode, site }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result && result.saved && mode === 'new') {
        this.siteService.createSite(result.site).subscribe(response => {
          this.fetchData();
          if (response.message === 'site created') {
            this.msgService.snackbar('Site créé');
          }
        });
      }
    });
  }

  public ngOnInit(): void {
    this.fetchData();
  }

  public fetchData(): void {
    this.siteService.getSitesAvailable().subscribe((sites: SiteDataModel[]) => {
      this.sites = sites;
      this.dataSource = new MatTableDataSource(this.sites);
      this.dataSource.sort = this.sort;
      const coordinates: [[number, number]] = [[0, 0]];
      coordinates.splice(0);
      sites.forEach(site => {
        coordinates.push([site.longitude, site.latitude]);
      });
      this.coordinatesToMark.next(coordinates);
    });
  }

  public deleteSite(site: SiteDataModel): void {
    if (confirm('Are you sure to delete ')) {
      if (site.label) {
        this.siteService.deleteSite(site, site.id).subscribe(() => {
          this.fetchData();
        });
      }
    }
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
