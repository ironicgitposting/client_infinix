import { autoserializeAs } from 'cerialize';
import { Vehicle } from '../vehicles-list/vehicle.model';
import { StatusModel } from '../common/models/StatusModel';
import { User } from '../users-list/user.model';
import { SiteDataModel } from '../sites-list/site.model';

export class LoanDataModel {
  @autoserializeAs('id')
  id: number;
  @autoserializeAs('Vehicule')
  lentVehicule: Vehicle;
  @autoserializeAs('startDate')
  startDate: Date;
  @autoserializeAs('endDate')
  endDate: Date | null;
  @autoserializeAs('Status')
  status: StatusModel;
  @autoserializeAs('User')
  driver: User;
  @autoserializeAs('departureSite')
  departureSite: SiteDataModel;
  @autoserializeAs('arrivalSite')
  arrivalSite: SiteDataModel;
}
