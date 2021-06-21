import { Injectable } from '@angular/core';
import { User } from '../users-list/user.model';


@Injectable({ providedIn: 'root' })
export class ApplicationSettingsService {

  private static getSettings(): null {
    return null;
  }

  private static updateSetting(user: User, settingId: Number, flag: Boolean) {

  }
}
