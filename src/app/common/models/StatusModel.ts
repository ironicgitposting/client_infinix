import { autoserializeAs } from 'cerialize';

export class StatusModel {
  @autoserializeAs('id')
  id: number;
  @autoserializeAs('label')
  label: string;
  @autoserializeAs('familyStatus')
  familyStatus: any;
}
