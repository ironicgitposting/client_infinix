import { Moment } from 'moment';

export interface Vehicle {
  type?: number;
  libelle?: string;
  site?: number;
  model: string;
  flagService?: boolean;
  status?: number;
  immatriculation?: string;
  state?: number;
}