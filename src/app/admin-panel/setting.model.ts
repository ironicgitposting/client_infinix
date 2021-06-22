import { autoserializeAs } from 'cerialize';

export class Setting {
    @autoserializeAs('id')
    id: number;
    @autoserializeAs('label')
    label: string;
    @autoserializeAs('description')
    description: string;
    @autoserializeAs('flag')
    flag: number;
    @autoserializeAs('type')
    type: number;
}
