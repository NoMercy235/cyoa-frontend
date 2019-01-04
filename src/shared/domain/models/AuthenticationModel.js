export class AuthenticationModel {
  email = '';
  password = '';
  repeatPassword = '';

  constructor (metadata) {
    Object.assign(this, metadata);
  }

  checkErrors(options) {
    const { isLoggingIn } = options;
    let errors = {};
    if (!this.email) {
      errors.email = 'This field is required';
    }
    if (!this.password) {
      errors.password = 'This field is required';
    }
    if (!isLoggingIn && !this.repeatPassword) {
      errors.repeatPassword = 'This field is required';
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
