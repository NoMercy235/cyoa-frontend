import { BaseModel } from './BaseModel';
import { ERRORS } from '../../constants/errors';

export class AuthenticationModel extends BaseModel {
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
    if (!this.email) {
      errors.email = ERRORS.fieldRequired;
    }
    if (!this.password) {
      errors.password = ERRORS.fieldRequired;
    }
    if (!isLoggingIn && !this.repeatPassword) {
      errors.repeatPassword = ERRORS.fieldRequired;
    }
    if (
      !isLoggingIn &&
      this.password &&
      this.repeatPassword &&
      this.password !== this.repeatPassword
    ) {
      errors.repeatPassword = 'Field must be the same as "Password"';
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
