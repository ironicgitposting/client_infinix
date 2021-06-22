import { autoserializeAs } from 'cerialize';

export class Setting {
    @autoserializeAs('id')
    id: number;
    @autoserializeAs('label')
    surname: string;
    @autoserializeAs('description')
    name: string;
    @autoserializeAs('flag')
    profession: number;
}
