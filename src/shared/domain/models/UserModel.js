export class UserModel {
  _id;
  email;
  firstName;
  isActive;
  isAdmin;
  lastName;

  constructor (metadata) {
    Object.assign(this, metadata);
  }
}
