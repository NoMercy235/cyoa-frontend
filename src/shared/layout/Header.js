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
import { styles } from '../layout/Styles';
import Button from '@material-ui/core/Button';
import { inject, observer } from 'mobx-react';
import { appPropTypes } from '../store/AppStore';
import Modal from '@material-ui/core/Modal';
import Authentication from '../components/authentication/Authentication';

@inject('appStore')
@observer
class Header extends Component {
  constructor (props) {
    super(props);
    this.props.appStore.registerModal({
      id: 'loginModal',
      component: <p>Hello world</p>,
    });
  }

  onShowLoginModal = () => {
    this.props.appStore.showModal('loginModal');
  };

  onHideLoginModal = () => {
    this.props.appStore.hideModal('loginModal');
  };

  render() {
    const { classes, drawerOpen } = this.props;

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
            <Button
              className={classNames(!drawerOpen && classes.appLoginButton)}
              onClick={this.onShowLoginModal}
              color="inherit"
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>

        <Modal
          className={classes.modalContainer}
          open={this.props.appStore.isModalOpen('loginModal')}
          onBackdropClick={this.onHideLoginModal}
        >
          <Authentication onCancel={this.onHideLoginModal} />
        </Modal>
      </Fragment>
    );
  }
}

Header.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onHandleDrawerOpened: PropTypes.func.isRequired,

  appStore: appPropTypes,
};

export default withStyles(styles, { withTheme: true })(Header);
