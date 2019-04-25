import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { styles } from '../Styles.css';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../../store/AppStore';

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
      <Fragment>
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
      </Fragment>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onHandleDrawerOpened: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(Header);
