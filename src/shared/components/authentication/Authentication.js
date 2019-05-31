import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button, Tooltip } from '@material-ui/core';

import { appStorePropTypes } from '../../store/AppStore';
import Snackbar, { SnackbarEnum } from '../snackbar/Snackbar';

import { styles } from './Authentication.css';

@inject('appStore')
@observer
class Authentication extends Component {
  snackbarRef = React.createRef();

  onLoginClick = () => {
    this.props.appStore.setIsAuthModalOpen(true);
  };

  onHandleLogout = (history) => () => {
    const { appStore } = this.props;

    appStore.setUser(null);
    appStore.generateLocalId();
    this.snackbarRef.current.showSnackbar({
      variant: SnackbarEnum.Variants.Success,
      message: 'Goodbye!',
    });
    localStorage.removeItem('jwt');
    history.replace('/');
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
            onClick={this.onHandleLogout(history)}
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
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

Authentication.propTypes = {
  classes: PropTypes.object.isRequired,
  onAuthSuccessful: PropTypes.func,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(Authentication);
