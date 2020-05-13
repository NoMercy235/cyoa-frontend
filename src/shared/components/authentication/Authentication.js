import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles, Typography } from '@material-ui/core';

import { appStorePropTypes } from '../../store/AppStore';
import { BroadcastEvents } from '../../constants/events';

import { styles } from './Authentication.css';
import { sendBroadcastMessage } from '../../BroadcastChannel';

@inject('appStore')
@observer
class Authentication extends Component {

  onLoginClick = () => {
    this.props.appStore.setIsAuthModalOpen(true);
  };

  onLogoutClickBroadcast = () => {
    this.props.onHandleLogout();
    sendBroadcastMessage({ type: BroadcastEvents.Logout });
  };

  renderLogin = () => {
    return (
      <Typography
        variant="button"
        onClick={this.onLoginClick}
        color="inherit"
      >
        Login
      </Typography>
    );
  };

  renderLogout = () => {
    const { user } = this.props.appStore;
    return (
      <Typography
        variant="button"
        onClick={this.onLogoutClickBroadcast}
        color="inherit"
      >
        Logout ({user.email})
      </Typography>
    );
  };

  render() {
    const { appStore } = this.props;

    return (
      <>
        {appStore.isLoggedIn
          ? this.renderLogout(this.props)
          : this.renderLogin(this.props)
        }
      </>
    );
  }
}

Authentication.propTypes = {
  classes: PropTypes.object.isRequired,
  onHandleLogout: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(
  Authentication
);
