import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators'

import { Router } from "@angular/router";
import { Vehicle } from "./vehicle.model";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private vehicles: Vehicle[] = [];
  private vehiclesUpdated = new Subject<{vehicles: Vehicle[]}>();

  constructor(private http: HttpClient, private router: Router ) {}

  getVehicles(): Observable<any> {
    return this.http.get('http://localhost:3000/api/v1/vehicules/');
  }

  getVehicleUpdateListener() {
    return this.vehiclesUpdated.asObservable();
  }

  updateVehicle(vehicle: Vehicle, lastImmatriculation: any){
    console.log(lastImmatriculation);
    console.log(vehicle);
    return this.http.put<any>('http://localhost:3000/api/v1/vehicules/update/'+ lastImmatriculation, vehicle);
  }

  deleteVehicle(vehicle: Vehicle) {
    return this.http.post<any>('http://localhost:3000/api/v1/vehicules/delete/' + vehicle.immatriculation, vehicle).subscribe(data => {
      this.getVehicles();
    });
  }

  createVehicle(vehicleData: Vehicle): Observable<any> {
    return this.http.post('http://localhost:3000/api/v1/vehicules/add/', vehicleData);
  }
}