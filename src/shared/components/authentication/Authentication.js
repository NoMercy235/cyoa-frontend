import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button, Tooltip } from '@material-ui/core';

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
    const { classes } = this.props;
    return (
      <>
        <Button
          onClick={this.onLoginClick}
          color="inherit"
        >
          Login
        </Button>
        <div className={classes.mainAuthArea}/>
      </>
    );
  };

  renderLogout = () => {
    const Logout = withRouter(({ history }) => (
      <>
        <Tooltip title="Logout">
          <Button
            onClick={this.onLogoutClick(history)}
            color="inherit"
          >
            Logout
          </Button>
        </Tooltip>
      </>
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
