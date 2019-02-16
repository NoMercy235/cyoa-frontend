import { BaseModel } from './BaseModel';

export class UserModel extends BaseModel {
  _id;
  email;
  firstName;
  isActive;
  isAdmin;
  lastName;

  constructor (metadata) {
    super();
    Object.assign(this, metadata);
  }
}
