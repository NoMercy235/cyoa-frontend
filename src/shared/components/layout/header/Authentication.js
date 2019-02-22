import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Exit from '@material-ui/icons/ExitToAppRounded';
import { styles } from '../Styles';
import Button from '@material-ui/core/Button';
import AuthenticationModal from '../../authentication/AuthenticationModal';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../../store/AppStore';
import { withRouter } from 'react-router-dom';
import Snackbar from '../../snackbar/Snackbar';

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

  renderLogin = (props) => {
    const { drawerOpen, classes } = props;
    return (
      <Button
        className={classNames(!drawerOpen && classes.appLoginButton)}
        onClick={this.onChangeState({ modalOpen: true })}
        color="inherit"
      >
        Login
      </Button>
    );
  };

  renderLogout = (props) => {
    const { drawerOpen, classes, appStore } = props;
    const Logout = withRouter(({ history }) => (
      <Fragment>
        {appStore.user.email}
        <Button
          className={classNames(!drawerOpen && classes.appLoginButton)}
          onClick={this.onHandleLogout(history)}
          color="inherit"
        >
          <Exit />
        </Button>
      </Fragment>
    ));
    return <Logout />;
  };

  render() {
    const { appStore } = this.props;

    return (
      <Fragment>
        {appStore.isLoggedIn
          ? this.renderLogout(this.props)
          : this.renderLogin(this.props)
        }
        <AuthenticationModal
          open={this.state.modalOpen}
          onClose={this.onChangeState({ modalOpen: false })}
        />
        <Snackbar
          open={this.state.snackbarOpen}
          onClose={this.onChangeState({ snackbarOpen: false })}
          message="Logout successfully!"
          variant="success"
        />
      </Fragment>
    );
  }
}

Authentication.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(Authentication);
