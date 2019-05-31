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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classNames from 'classnames';

import { appStorePropTypes } from '../../../store/AppStore';
import ttaLogo from '../../../../assets/tta-logo.png';
import { LANDING_ROUTE } from '../../../constants/routes';
import MenuDropdown from '../../menu/MenuDropdown';
import Authentication from '../../authentication/Authentication';

import { styles } from '../Styles.css';

@inject('appStore')
@observer
class Header extends Component {
  goToLanding = () => {
    this.props.history.push(LANDING_ROUTE);
  };

  renderAuthBtn = () => {
    return <Authentication/>;
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
        closeOnItemClick={false}
      >
        <IconButton
          color="inherit"
        >
          <MoreVertIcon/>
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
          className={classNames(classes.appTitle, classes.clickable)}
          variant="h6"
          color="inherit"
          noWrap
          onClick={this.goToLanding}
        >
          Choose your own adventure!
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
