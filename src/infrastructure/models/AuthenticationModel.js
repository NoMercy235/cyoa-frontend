import { BaseModel } from './BaseModel';
import { ERRORS } from '../../shared/constants/errors';

const PASSWORD_MIN_LENGTH = 6;

export class AuthenticationModel extends BaseModel {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  repeatPassword = '';

  constructor (metadata, options) {
    super(metadata, options);
    this.assignToSelf(metadata);
  }

  checkErrors(ignoreFields = []) {
    let errors = {};

    ['firstName', 'lastName', 'email', 'password', 'repeatPassword']
      .filter(field => !ignoreFields.includes(field))
      .forEach(f => {
        if (!this[f]) errors[f] = ERRORS.fieldRequired;
      });

    if (
      this.password &&
      this.repeatPassword
    ) {
      if (!AuthenticationModel.validatePassword(this.password)) {
        errors.password = `Password must have at least ${PASSWORD_MIN_LENGTH} characters`;
      } else if (this.password !== this.repeatPassword) {
        errors.repeatPassword = 'Field must be the same as "Password"';
      }
    }

    if (!ignoreFields.includes('email') && !AuthenticationModel.validateEmail(this.email)) {
      errors.email = 'Email is invalid';
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

  static validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  static validatePassword = (password) => {
    return !!password && (password.length >= PASSWORD_MIN_LENGTH);
  };
}
