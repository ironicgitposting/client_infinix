import { autoserializeAs } from 'cerialize';
import { StatusModel } from '../common/models/StatusModel';

export class SiteDataModel {
  @autoserializeAs('id')
  id: number;
  @autoserializeAs('label')
  label: string;
  @autoserializeAs('adress')
  adress: string;
  @autoserializeAs('postalCode')
  postalCode: string;
  @autoserializeAs('city')
  city: string;
  @autoserializeAs('phone')
  phone: string;
  @autoserializeAs('mail')
  mail: string;
  @autoserializeAs('pays')
  pays: string;
  @autoserializeAs('status')
  status: StatusModel;
  @autoserializeAs('latitude')
  latitude: number;
  @autoserializeAs('longitude')
  longitude: number;
}
