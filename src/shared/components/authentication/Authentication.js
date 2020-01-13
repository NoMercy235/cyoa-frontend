import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Typography } from '@material-ui/core';

import { appStorePropTypes } from '../../store/AppStore';
import { BROADCAST_CHANNEL_NAME, BroadcastEvents } from '../../constants/events';

import { styles } from './Authentication.css';

const RigamoBC = new BroadcastChannel(BROADCAST_CHANNEL_NAME);

@inject('appStore')
@observer
class Authentication extends Component {
  componentDidMount () {
    RigamoBC.onmessage = ({ data: { type } }) => {
      if (type !== BroadcastEvents.Logout) return;
      this.onLogoutClick();
    }
  }

  onLoginClick = () => {
    this.props.appStore.setIsAuthModalOpen(true);
  };

  onLogoutClick = () => {
    const { history, onHandleLogout } = this.props;
    onHandleLogout(history);
  };

  onLogoutClickBroadcast = () => {
    this.onLogoutClick();
    RigamoBC.postMessage({ type: BroadcastEvents.Logout });
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
  withRouter(Authentication)
);
