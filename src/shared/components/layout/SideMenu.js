import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
  withStyles,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import ViewStoryIcon from '@material-ui/icons/Pageview';

import { appStorePropTypes } from '../../store/AppStore';
import { ADMIN_STORIES_ROUTE } from '../../constants/routes';
import Authentication from '../authentication/Authentication';
import ttaLogo from '../../../assets/tta-logo.png';

import { styles } from './Styles.css';

const publicMenu = [
  {
    name: 'home',
    label: 'Home',
    route: '/',
    icon: <HomeIcon />,
  },
];

const adminMenu = [
  {
    name: 'myStories',
    label: 'My stories',
    route: ADMIN_STORIES_ROUTE,
    icon: <ViewStoryIcon />,
  },
];

@inject('appStore')
@observer
class SideMenu extends Component {
  onItemClick = (item, history) => () => {
    history.push(item.route);
    this.props.onHandleDrawerClose();
  };

  renderItem = (item) => {
    const Item = withRouter(({ history }) => (
      <ListItem button onClick={this.onItemClick(item, history)}>
        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
        <ListItemText primary={item.label} />
      </ListItem>
    ));

    return <Item key={item.name} />;
  };

  renderAuthentication = () => {
    return (
      <ListItem
        button
        component={Authentication}
      >
        <ListItemIcon>
          <HomeIcon/>
        </ListItemIcon>
      </ListItem>
    );
  };

  renderAdminMenu = () => {
    const { appStore: { isLoggedIn } } = this.props;
    if (!isLoggedIn) {
      return (
        <ListItem>
          <ListItemIcon>
            <InfoIcon/>
          </ListItemIcon>
          <ListItemText primary="Log in to use additional features"/>
        </ListItem>
      );
    }
    return adminMenu.map(this.renderItem);
  };

  render() {
    const { classes, open, onHandleDrawerClose } = this.props;

    return (
      <>
        <Drawer
          open={open}
          onClose={onHandleDrawerClose}
          classes={{ paper: classes.sideMenu }}
        >
          <img
            alt="Cover"
            src={ttaLogo}
            className={classes.logoImg}
          />
          <Divider />
          <div className={classes.sideMenuHeader}>
            {this.renderAuthentication()}
            <IconButton onClick={onHandleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            {publicMenu.map(this.renderItem)}
          </List>
          <Divider />
          <List>
            {this.renderAdminMenu()}
          </List>
        </Drawer>
      </>
    );
  }
}

SideMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onHandleDrawerClose: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(SideMenu);
