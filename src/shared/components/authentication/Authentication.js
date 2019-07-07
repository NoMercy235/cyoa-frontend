import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Typography } from '@material-ui/core';

import { appStorePropTypes } from '../../store/AppStore';

import { styles } from './Authentication.css';

@inject('appStore')
@observer
class Authentication extends Component {
  onLoginClick = () => {
    this.props.appStore.setIsAuthModalOpen(true);
  };

  onLogoutClick = history => () => {
    this.props.onHandleLogout(history);
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
    const Logout = withRouter(({ history }) => (
      <Typography
        variant="button"
        onClick={this.onLogoutClick(history)}
        color="inherit"
      >
        Logout ({user.email})
      </Typography>
    ));
    return <Logout />;
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

export default withStyles(styles)(Authentication);
