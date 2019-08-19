import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
  withStyles,
  AppBar,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import classNames from 'classnames';

import { appStorePropTypes } from '../../../store/AppStore';
import ttaLogo from '../../../../assets/tta-logo.png';
import { LANDING_ROUTE } from '../../../constants/routes';
import MenuDropdown from '../../menu/MenuDropdown';
import Authentication from '../../authentication/Authentication';
import { SnackbarEnum } from '../../snackbar/Snackbar';
import Snackbar from '../../snackbar/Snackbar';

import { styles } from '../Styles.css';

@inject('appStore')
@observer
class Header extends Component {
  snackbarRef = React.createRef();

  goToLanding = () => {
    this.props.history.push(LANDING_ROUTE);
  };

  onHandleLogout = history => {
    const { appStore } = this.props;

    appStore.setUser(null);
    appStore.generateLocalId();
    this.snackbarRef.current.showSnackbar({
      variant: SnackbarEnum.Variants.Success,
      message: 'Goodbye!',
    });
    localStorage.removeItem('jwt');
    if (!window.location.pathname.startsWith('/public')) {
      history.replace('/');
    }
  };

  renderAuthBtn = () => {
    return <Authentication onHandleLogout={this.onHandleLogout}/>;
  };

  getMenuItems = () => {
    return [
      this.renderAuthBtn(),
    ].filter(el => el);
  };

  renderSettings = () => {
    const { classes } = this.props;
    return (
      <MenuDropdown
        className={classes.settingsBtn}
        items={this.getMenuItems()}
      >
        <IconButton color="inherit" id="settingsBtn"  aria-label="Settings">
          <AccountCircle/>
        </IconButton>
      </MenuDropdown>
    );
  };

  renderAppTitle = () => {
    const { classes } = this.props;

    return (
      <>
        <img
          alt="Cover"
          src={ttaLogo}
          className={classNames(classes.headerLogo, classes.clickable)}
          onClick={this.goToLanding}
        />
        <Typography
          className={classes.appTitle}
          variant="h6"
          color="inherit"
          noWrap
        >
          Rigamo
        </Typography>
      </>
    );
  };

  render() {
    const {
      classes,
      onHandleDrawerOpened,
      appStore: {
        HeaderCmp,
      },
    } = this.props;

    return (
      <>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classes.appBar}
        >
          <Toolbar disableGutters={true}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={onHandleDrawerOpened}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            {this.renderAppTitle()}
            {HeaderCmp && <HeaderCmp />}
            {this.renderSettings()}
          </Toolbar>
        </AppBar>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  onHandleDrawerOpened: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(
  withRouter(Header),
);
