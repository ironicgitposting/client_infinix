import { Moment } from 'moment';

export interface User {
  surname?: string;
  name?: string;
  profession?: number;
  email: string;
  telephone?: string;
  authorizationAccess?: string;
  dateLastSeen?: Moment;
  site?: number;
  language?: number;
  archived?: boolean;
  enabled?: boolean;
}
