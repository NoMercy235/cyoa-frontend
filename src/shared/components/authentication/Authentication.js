import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withStyles, Button, Tooltip } from '@material-ui/core';

import AuthenticationModal from './AuthenticationModal';
import { appStorePropTypes } from '../../store/AppStore';
import Snackbar, { SnackbarEnum } from '../snackbar/Snackbar';

import { styles } from './Authentication.css';

@inject('appStore')
@observer
class Authentication extends Component {
  state = {
    modalOpen: false,
  };
  snackbarRef = React.createRef();

  onChangeState = (metadata) => () => {
    this.setState(metadata);
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

  onAuthSuccessful = () => {
    const { onAuthSuccessful } = this.props;
    this.snackbarRef.current.showSnackbar({
      variant: SnackbarEnum.Variants.Success,
      message: 'Welcome!',
    });
    onAuthSuccessful && onAuthSuccessful();
  };

  renderLogin = () => {
    const { classes } = this.props;
    return (
      <>
        <Button
          onClick={this.onChangeState({ modalOpen: true })}
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
    const { modalOpen } = this.state;

    return (
      <>
        {appStore.isLoggedIn
          ? this.renderLogout(this.props)
          : this.renderLogin(this.props)
        }
        <AuthenticationModal
          open={modalOpen}
          onSuccess={this.onAuthSuccessful}
          onClose={this.onChangeState({ modalOpen: false })}
        />
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
