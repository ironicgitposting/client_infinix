import { autoserializeAs } from 'cerialize';
import { StatusModel } from '../common/models/StatusModel';

export class SinisterModel {
  @autoserializeAs('id')
  id: number;
  @autoserializeAs('libelle')
  libelle: string;
  @autoserializeAs('status')
  status: StatusModel;
  @autoserializeAs('idVehicle')
  idVehicle: number;
  @autoserializeAs('createdAt')
  createdAt: Date;
  @autoserializeAs('updatedAt')
  updatedAt: Date;
}
