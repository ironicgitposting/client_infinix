import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';
import { HttpClient } from '@angular/common/http';
import { StatusModel } from '../models/StatusModel';

@Injectable()
export class StatusService {

  constructor(private httpClient: HttpClient) {}

  public getStatus(): Observable<StatusModel[]> {
    return this.httpClient.get('http://localhost:3000/api/v1/status/').pipe(
      map((response: any) => { console.log(response.status); return Deserialize(response.status, StatusModel); })
    );
  }

}
