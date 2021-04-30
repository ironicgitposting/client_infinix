import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationDataModel } from '../authentication/authentication.data.model';
import { LoanDataModel } from './loan.data.model';
import { Observable } from 'rxjs';

@Injectable()
export class LoanService {

  constructor (private httpClient: HttpClient) {}

  public createLoan(loanData: LoanDataModel): Observable<any> {
    return this.httpClient.post('http://localhost:3000/api/v1/booking/create', loanData);
  }

  public getAllLoans(): Observable<any> {
    return this.httpClient.get('http://localhost:3000/api/v1/booking/');
  }
}
