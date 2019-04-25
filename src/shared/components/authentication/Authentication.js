import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Exit from '@material-ui/icons/ExitToAppRounded';
import { styles } from './Authentication.css';
import Button from '@material-ui/core/Button';
import AuthenticationModal from './AuthenticationModal';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import { withRouter } from 'react-router-dom';
import Snackbar from '../snackbar/Snackbar';
import { Tooltip } from '@material-ui/core';
import classNames from 'classnames';

@inject('appStore')
@observer
class Authentication extends Component {
  state = {
    modalOpen: false,
    snackbarOpen: false,
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  onHandleLogout = (history) => () => {
    this.props.appStore.setUser(null);
    this.onChangeState({ snackbarOpen: true })();
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    history.replace('/');
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
    const { classes, appStore } = this.props;
    const Logout = withRouter(({ history }) => (
      <>
        <div className={classNames(classes.mainAuthArea, classes.userEmail)}>
          {appStore.user.email}
        </div>
        <Tooltip title="Logout">
          <Button
            onClick={this.onHandleLogout(history)}
            color="inherit"
          >
            <Exit />
          </Button>
        </Tooltip>
      </>
    ));
    return <Logout />;
  };

  render() {
    const { appStore, onAuthSuccessful } = this.props;
    const { modalOpen, snackbarOpen } = this.state;

    return (
      <Fragment>
        {appStore.isLoggedIn
          ? this.renderLogout(this.props)
          : this.renderLogin(this.props)
        }
        <AuthenticationModal
          open={modalOpen}
          onSuccess={onAuthSuccessful}
          onClose={this.onChangeState({ modalOpen: false })}
        />
        <Snackbar
          open={snackbarOpen}
          onClose={this.onChangeState({ snackbarOpen: false })}
          message="Logout successfully!"
          variant="success"
        />
      </Fragment>
    );
  }
}

Authentication.propTypes = {
  classes: PropTypes.object.isRequired,
  onAuthSuccessful: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(Authentication);
