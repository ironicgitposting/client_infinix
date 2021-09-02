import { autoserializeAs } from 'cerialize';
import { SiteDataModel } from '../sites-list/site.model';
import { StatusModel } from '../common/models/StatusModel';

export class Vehicle {
  @autoserializeAs('id')
  id: number;
  @autoserializeAs('type')
  type: number;
  @autoserializeAs('libelle')
  libelle: string;
  @autoserializeAs('model')
  model: string;
  @autoserializeAs('flagService')
  flagService: boolean;
  @autoserializeAs('immatriculation')
  immatriculation: string;
  @autoserializeAs('state')
  state: string;
  @autoserializeAs('Site')
  site: SiteDataModel;
  @autoserializeAs('status')
  status: StatusModel;
  @autoserializeAs('essenceVehicule')
  essenceVehicule: number;
  @autoserializeAs('killometrageVehicle')
  killometrageVehicle: number;
}
