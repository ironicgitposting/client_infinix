import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoanDataModel } from './loan.data.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';
import { Vehicle } from '../vehicles-list/vehicle.model';
import { User } from '../users-list/user.model';

@Injectable()
export class LoanService {

  constructor(private httpClient: HttpClient) {}

  public createLoan(loanData: LoanDataModel): Observable<any> {
    return this.httpClient.post('http://localhost:3000/api/v1/booking/create', loanData);
  }
  public getAllLoans(): Observable<any> {
    return this.httpClient.get('http://localhost:3000/api/v1/booking/').pipe(
      map((response: any) => Deserialize(response.booking, LoanDataModel))
    );
  }

  public getAllLoansForVehicle(vehicle: Vehicle){
    return this.httpClient.get('http://localhost:3000/api/v1/booking/for-vehicle/' + vehicle.immatriculation);
  }

  public getLoansByStatus(status: any): Observable<any> {
    return this.httpClient.get('http://localhost:3000/api/v1/booking/status/' + status );
  }

  public getLoansByBooking(status: any, email:any): Observable<any> {
    return this.httpClient.get('http://localhost:3000/api/v1/booking/status/' + status + '&'+email);
  }

  public getLoansByUtilisateur(email: string): Observable<any> {
    return this.httpClient.get('http://localhost:3000/api/v1/booking/for-utilisateur/' + email);
  }
}
