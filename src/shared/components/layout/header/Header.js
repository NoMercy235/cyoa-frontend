import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
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

import { appStorePropTypes } from '../../../store/AppStore';

import { styles } from '../Styles.css';

@inject('appStore')
@observer
class Header extends Component {
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
            <Typography
              className={classes.appTitle}
              variant="h6"
              color="inherit"
              noWrap
            >
              Choose your own adventure!
            </Typography>
            {HeaderCmp && <HeaderCmp />}
          </Toolbar>
        </AppBar>
      </>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onHandleDrawerOpened: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(Header);
