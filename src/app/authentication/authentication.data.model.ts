import { autoserializeAs } from 'cerialize';

export class AuthenticationDataModel {
  @autoserializeAs('email')
  email: string;
  @autoserializeAs('password')
  password: string;
  @autoserializeAs('name')
  name: string;
  @autoserializeAs('surname')
  surname: string;
  @autoserializeAs('phone')
  telephone: string;
}
