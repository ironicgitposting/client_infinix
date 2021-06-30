import { autoserializeAs } from 'cerialize';
import { StatusModel } from '../common/models/StatusModel';
import { Vehicle } from '../vehicles-list/vehicle.model';

export class SinisterModel {
    @autoserializeAs('id')
    id: number;
    @autoserializeAs('libelle')
    libelle: string;
    @autoserializeAs('status')
    status: StatusModel;
    @autoserializeAs('idVehicle')
    idVehicle: Vehicle;
}