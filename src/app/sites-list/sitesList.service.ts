import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { Site } from './site.model';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private sites: Site[] = [];
  private sitesUpdated = new Subject<{sites: Site[]}>();

  constructor(private http: HttpClient, private router: Router ) {}
  public createSite(site: Site): Observable<any> {
    console.log("Le sitee :", site );
    return this.http.post('http://localhost:3000/api/v1/sites/create', site);
  }
  getSites(): Observable<any> {
    /*this.http.get<{site: any}>('http://localhost:3000/api/v1/sites')
    .pipe(map((postData) => {
      return {sites: postData.site.map((site: any) => {
        console.log(site);
        return {
          id: site.id,
          label: site.label,
          adress: site.adress,
          postalCode: site.postalCode,
          city: site.city,
          phone: site.phone,
          mail: site.mail,
          pays: site.pays
        };
      })};
    }))
    .subscribe((transformedSiteData) => {
      this.sites = transformedSiteData.sites;
      this.sitesUpdated.next({
        sites: [...this.sites]
      });
      console.log(this.sites);
    });*/
    return this.http.get('http://localhost:3000/api/v1/sites/');
  }

  getSiteUpdateListener(): Observable<any> {
    return this.sitesUpdated.asObservable();
  }

  updateSite(site: Site) {
    console.log(site.label);
    console.log(site);
    return this.http.put<any>('http://localhost:3000/api/v1/sites/update/' + site.label, site).subscribe();
  }

  deleteSite(site: Site) {
    return this.http.post<any>('http://localhost:3000/api/v1/sites/delete/' + site.label, site).subscribe();
  }
}
