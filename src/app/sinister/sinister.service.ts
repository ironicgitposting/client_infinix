import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SinisterModel } from './sinister.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

@Injectable({
    providedIn: 'root',
})
export class SinisterService {

    constructor(private http: HttpClient) {

    }

    public getSinisters(idVehicle: number, idStatus: number | null): Observable<any> {
        return this.http.get('http://localhost:3000/api/v1/sinisters/'+idVehicle+'&'+idStatus).pipe(
            map((response: any) => Deserialize(response.sinisters, SinisterModel)),
        );
    }

    public createSinister(sinisterData: SinisterModel): Observable<any> {
        return this.http.post('http://localhost:3000/api/v1/sinisters/create/', sinisterData); 
    }

    public updateSinister(sinisterData: SinisterModel): Observable<any> {
        return this.http.post('http://localhost:3000/api/v1/sinisters/update/' + sinisterData.id, sinisterData);
    }
}