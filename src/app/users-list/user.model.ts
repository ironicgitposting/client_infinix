import { Moment } from 'moment';
import { autoserializeAs } from 'cerialize';

export class User {
  @autoserializeAs('id')
  id: number;
  @autoserializeAs('surname')
  surname: string;
  @autoserializeAs('name')
  name: string;
  @autoserializeAs('profession')
  profession: number;
  @autoserializeAs('email')
  email: string;
  @autoserializeAs('telephone')
  telephone: string;
  @autoserializeAs('authorizationAccess')
  authorizationAccess: number;
  @autoserializeAs('dateLastSeen')
  dateLastSeen: Moment;
  @autoserializeAs('site')
  site: number;
  @autoserializeAs('language')
  language: number;
  @autoserializeAs('archived')
  archived: boolean;
  @autoserializeAs('enabled')
  enabled: boolean;
  @autoserializeAs('profile')
  profile: boolean;
}
