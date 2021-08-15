import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deserialize } from 'cerialize';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { Setting } from './setting.model';



@Injectable({ providedIn: 'root' })
export class ApplicationSettingsService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  public getSettings(): Observable<any> {
    return this.http.get('http://localhost:3000/api/v1/settings/').pipe(
      map((response: any) => Deserialize(response.settings, Setting))
    );
  }


  public updateSetting(setting: Setting): void {
    if (this.authService.getIsAdmin()) {
      this.http.put<any>('http://localhost:3000/api/v1/settings/update/' + setting.id, setting).subscribe();
    }
  }
}
