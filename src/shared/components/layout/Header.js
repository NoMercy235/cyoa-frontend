import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Exit from '@material-ui/icons/ExitToAppRounded';
import { styles } from './Styles';
import Button from '@material-ui/core/Button';
import AuthenticationModal from '../authentication/AuthenticationModal';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import { withRouter } from 'react-router-dom';

@inject('appStore')
@observer
class Header extends Component {
  constructor (props) {
    super(props);
    this.state = { modalOpen: false };
  }

  onShowLoginModal = () => {
    this.setState({ modalOpen: true });
  };

  onHideLoginModal = () => {
    this.setState({ modalOpen: false });
  };

  onHandleLogout = (history) => () => {
    this.props.appStore.setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    history.replace('/');
  };

  renderLogin = (props) => {
    const { drawerOpen, classes } = props;
    return (
      <Button
        className={classNames(!drawerOpen && classes.appLoginButton)}
        onClick={this.onShowLoginModal}
        color="inherit"
      >
        Login
      </Button>
    );
  };

  renderLogout = (props) => {
    const { drawerOpen, classes } = props;
    const Logout = withRouter(({ history }) => (
      <Button
        className={classNames(!drawerOpen && classes.appLoginButton)}
        onClick={this.onHandleLogout(history)}
        color="inherit"
      >
        <Exit />
      </Button>
    ));
    return <Logout />;
  };

  render() {
    const { classes, drawerOpen, appStore } = this.props;

    return (
      <Fragment>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: drawerOpen,
          })}
        >
          <Toolbar disableGutters={!drawerOpen}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.props.onHandleDrawerOpened}
              className={classNames(classes.menuButton, drawerOpen && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className={classes.appTitle}
              variant="h6"
              color="inherit"
              noWrap
            >
              Choose your own adventure!
            </Typography>
            {appStore.isLoggedIn
              ? this.renderLogout(this.props)
              : this.renderLogin(this.props)
            }
          </Toolbar>
        </AppBar>

        <AuthenticationModal
          open={this.state.modalOpen}
          onClose={this.onHideLoginModal}
        />
      </Fragment>
    );
  }
}

Header.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onHandleDrawerOpened: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(Header);
