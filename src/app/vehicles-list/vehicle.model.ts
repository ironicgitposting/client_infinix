import { autoserializeAs } from 'cerialize';
import { SiteDataModel } from '../site/site.data.model';
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
  state: number;
  @autoserializeAs('Site')
  site: SiteDataModel;
  @autoserializeAs('status')
  status: StatusModel;
}
