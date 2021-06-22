import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deserialize } from 'cerialize';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { Setting } from './setting.model';



@Injectable({ providedIn: 'root' })
export class ApplicationSettingsService {

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  public getSettings() {
    return this.http.get('http://localhost:3000/api/v1/settings').pipe(
      map((response: any) => Deserialize(response.settings, Setting))
    );
  }

  public updateSetting(setting: Setting) {
    if (this.authService.getIsAdmin()) {
      // Update setting there
    }
  }
}
