import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';

export class AuthenticationModel extends BaseModel {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  repeatPassword = '';

  constructor (metadata) {
    super();
    Object.assign(this, metadata);
  }

  checkErrors(options) {
    const { isLoggingIn } = options;
    let errors = {};

    ['firstName', 'lastName', 'email', 'password', 'repeatPassword'].forEach(f => {
      if (!this[f]) errors[f] = ERRORS.fieldRequired;
    });

    if (
      this.password &&
      this.repeatPassword &&
      this.password !== this.repeatPassword
    ) {
      errors.repeatPassword = 'Field must be the same as "Password"';
    }

    if (isLoggingIn) {
      delete errors.firstName;
      delete errors.lastName;
      delete errors.repeatPassword;
    }

    return errors;
  }

  asJson() {
    return {
      email: this.email,
      password: this.password,
      repeatPassword: this.repeatPassword,
    };
  }
}
