import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';

export class UserModel extends BaseModel {
  _id;
  email;
  firstName;
  isActive;
  isAdmin;
  lastName;

  constructor (metadata, options) {
    super(metadata, options);
    this.assignToSelf(metadata, options);
  }

  checkErrors = () => {
    let errors = {};
    ['email', 'firstName', 'lastName'].forEach(field => {
      if (!this[field]) {
        errors[field] = ERRORS.fieldRequired;
      }
    });
    return errors;
  };

  static forApi(user) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      description: user.description,
    };
  }
}
