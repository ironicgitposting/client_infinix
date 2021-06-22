import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { SiteDataModel } from './site.model';
import {Observable, Subject} from 'rxjs';
import { Deserialize } from 'cerialize';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private sites: SiteDataModel[] = [];
  private sitesUpdated = new Subject<{sites: SiteDataModel[]}>();

  constructor(private http: HttpClient, private router: Router ) {}
  public createSite(site: SiteDataModel): Observable<any> {
    console.log("Le site en question :", site );
    return this.http.post('http://localhost:3000/api/v1/sites/create', site);
  }
  getSitesAvailable(): Observable<any> {

    return this.http.get('http://localhost:3000/api/v1/sites/').pipe(
      map((response: any) => Deserialize(response.sites, SiteDataModel))
    );;
  }

  getSiteUpdateListener(): Observable<any> {
    return this.sitesUpdated.asObservable();
  }

  updateSite(site: SiteDataModel, lastlabel: any) {
    return this.http.put<any>('http://localhost:3000/api/v1/sites/update/' + lastlabel, site);
  }

  deleteSite(site: SiteDataModel, id: any) {
    return this.http.post<any>('http://localhost:3000/api/v1/sites/delete/' + id, site);
  }
}
