import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { SinisterModel } from './sinister.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

@Injectable({
    providedIn: 'root',
})
export class SinisterService {

    constructor(private http: HttpClient, private router: Router) {

    }

    getSinisters(): Observable<any> {
        return this.http.get('http://localhost:3000/api/v1/sinisters/').pipe(
            map((response: any) => Deserialize(response.sinisters, SinisterModel)),
        );
    }

    updateSinister() {

    }
}