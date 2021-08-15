import { Moment } from 'moment';
import { autoserializeAs } from 'cerialize';
import { SiteDataModel } from '../sites-list/site.model';

export class User {
  @autoserializeAs('id')
  id: number;
  @autoserializeAs('surname')
  surname: string;
  @autoserializeAs('name')
  name: string;
  @autoserializeAs('profession')
  profession: string;
  @autoserializeAs('email')
  email: string;
  @autoserializeAs('telephone')
  telephone: string;
  @autoserializeAs('authorizationAccess')
  authorizationAccess: number;
  @autoserializeAs('dateLastSeen')
  dateLastSeen: Moment;
  @autoserializeAs('site')
  site: SiteDataModel;
  @autoserializeAs('language')
  language: number;
  @autoserializeAs('archived')
  archived: boolean;
  @autoserializeAs('enabled')
  enabled: boolean;
  @autoserializeAs('profile')
  profile: boolean;
}
