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
    /*
    this.http.get<{vehicules: any}>('http://localhost:3000/api/v1/vehicules')
    .pipe(map((postData) => {
      return {vehicules: postData.vehicules.map((vehicle: any) => {
        return {
          type: vehicle.type,
          libelle: vehicle.libelle,
          site: vehicle.site,
          model: vehicle.model,
          flagService: vehicle.flagService,
          status: vehicle.status,
          immatriculation: vehicle.immatriculation,
          state: vehicle.state
        }
      })}
    })).subscribe((transformedUserData) => {
        this.vehicles = transformedUserData.vehicules;
        this.vehiclesUpdated.next({
            vehicles: [...this.vehicles]
        })
        
      }) */
      return this.http.get('http://localhost:3000/api/v1/vehicules/');
  }

  getVehicleUpdateListener() {
    return this.vehiclesUpdated.asObservable();
  }

  updateVehicle(vehicle: Vehicle, lastImmatriculation: any){
    console.log(lastImmatriculation);
    console.log(vehicle);
    return this.http.put<any>('http://localhost:3000/api/v1/vehicules/update/'+ lastImmatriculation, vehicle).subscribe(data => {
      this.getVehicles();
    });
  }

  deleteVehicle(vehicle: Vehicle) {
    return this.http.post<any>('http://localhost:3000/api/v1/vehicules/delete/' + vehicle.immatriculation, vehicle).subscribe(data => {
      this.getVehicles();
    });
  }
}