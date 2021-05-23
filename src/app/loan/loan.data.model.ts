import { autoserializeAs } from 'cerialize';
import { Vehicle } from '../vehicles-list/vehicle.model';
import { StatusModel } from '../common/models/StatusModel';
import { User } from '../users-list/user.model';
import { SiteDataModel } from '../site/site.data.model';

export class LoanDataModel {
  @autoserializeAs('id')
  id: number;
  @autoserializeAs('lentVehicule')
  lentVehicule: Vehicle;
  @autoserializeAs('startDate')
  startDate: Date;
  @autoserializeAs('endDate')
  endDate: Date;
  @autoserializeAs('Status')
  status: StatusModel;
  @autoserializeAs('User')
  driver: User;
  @autoserializeAs('Site')
  site: SiteDataModel;
}
