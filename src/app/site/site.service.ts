import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationDataModel } from '../authentication/authentication.data.model';
import { SiteDataModel } from './site.data.model';
import { Observable } from 'rxjs';

@Injectable()
export class SiteService {

  constructor (private httpClient: HttpClient) {}

  public createSite(siteData: SiteDataModel): Observable<any> {
    return this.httpClient.post('http://localhost:3000/api/v1/site/create', siteData);
  }

  public getAllSites(): Observable<any> {
    return this.httpClient.get('http://localhost:3000/api/v1/site/');
  }
}
