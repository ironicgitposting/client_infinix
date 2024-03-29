import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { Vehicle } from './vehicle.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {

  private vehicles: Vehicle[] = [];
  private vehiclesUpdated = new Subject<{ vehicles: Vehicle[] }>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getVehicles(): Observable<any> {
    return this.http.get('http://localhost:3000/api/v1/vehicules/').pipe(
      map((response: any) => Deserialize(response.vehicules, Vehicle)),
    );
  }

  getAvailableVehicles(startDate: Date, endDate: Date | null): Observable<any> {
    return this.http.get(`http://localhost:3000/api/v1/vehicules/available/${startDate}&${endDate}`).pipe(
      map((response: any) => Deserialize(response.vehicules, Vehicle)),
    );
  }

  getVehicleUpdateListener() {
    return this.vehiclesUpdated.asObservable();
  }

  updateVehicle(vehicle: Vehicle, lastImmatriculation: any) {
    return this.http.put<any>('http://localhost:3000/api/v1/vehicules/update/' + lastImmatriculation, vehicle);
  }

  deleteVehicle(vehicle: Vehicle) {
    return this.http.post<any>('http://localhost:3000/api/v1/vehicules/delete/' + vehicle.immatriculation, vehicle);
  }

  createVehicle(vehicleData: Vehicle): Observable<any> {
    return this.http.post('http://localhost:3000/api/v1/vehicules/add/', vehicleData);
  }
}
