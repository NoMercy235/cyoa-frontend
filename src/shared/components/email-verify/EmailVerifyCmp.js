import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import { authService } from '../../../infrastructure/services/AuthenticationService';
import LoadingCmp from '../loading/LoadingCmp';
import ReturnHome from '../return-home/ReturnHome';

import classes from './EmailVerifyCmp.module.scss';
import sadFace from '../../../assets/sad-face.png';

class NotFoundCmp extends Component {
  state = { error: false };

  async componentDidMount () {
    const {
      match: {
        params: {
          token: verifyToken,
        },
      },
    } = this.props;

    try {
      const {
        emailVerifyToken: { redirectUrl },
        token,
      } = await authService.verifyEmail(verifyToken);

      localStorage.setItem('jwt', token);

      window.location.href = redirectUrl;
    } catch (e) {
      this.setState({ error: true });
    }
  }

  renderError() {
    return (
      <div className={classes.container}>
        <div className={classes.text}>
          <Typography variant="h4">
            Token is invalid
          </Typography>
          <ReturnHome
            variant="h5"
            text="Read some stories instead?"
          />
        </div>
        <img
          alt="Token invalid"
          className={classes.sadFace}
          src={sadFace}
        />
      </div>
    );
  }

  render() {
    const { error } = this.state;

    if (error) {
      return this.renderError();
    }

    return (
      <div className={classes.container}>
        <LoadingCmp
          text="Verifying email!"
          textVariant="h4"
          thickness={5}
          size={150}
        />
      </div>
    );
  }
}

export default withRouter(NotFoundCmp);
