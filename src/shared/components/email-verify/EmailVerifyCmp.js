import React, { Component } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import { authService } from '../../../infrastructure/services/AuthenticationService';

import classes from './EmailVerifyCmp.module.scss';

class NotFoundCmp extends Component {
  async componentDidMount () {
    const {
      match: {
        params: {
          token: verifyToken
        }
      },
    } = this.props;
    const {
      emailVerifyToken: { redirectUrl },
      token
    } = await authService.verifyEmail(verifyToken);

    localStorage.setItem('jwt', token);

    window.location.href = redirectUrl;
  }

  render() {
    return (
      <div className={classes.container}>
        <Typography
          variant="h4"
          color="inherit"
        >
          Verifying email!
        </Typography>
        <CircularProgress
          thickness={5}
          size={150}
        />
      </div>
    );
  }
}

export default withRouter(NotFoundCmp);
