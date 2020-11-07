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
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import ArrowBack from '@material-ui/icons/ArrowBackOutlined';
import ViewStoryIcon from '@material-ui/icons/Pageview';
import UserIcon from '@material-ui/icons/Face';
import BugReportIcon from '@material-ui/icons/BugReport';
import FeatureRequestIcon from '@material-ui/icons/AssignmentTurnedIn';

import { appStorePropTypes } from '../../store/AppStore';
import { ADMIN_PROFILE_ROUTE, ADMIN_STORIES_ROUTE, LANDING_ROUTE } from '../../constants/routes';
import ttaLogo from '../../../assets/tta-logo.png';
import gitHub from '../../../assets/github.png';
import withAuthCmp from '../../hoc/withAuthCmp';
import {
  APP_GITHUB_FEATURE_REQUEST_URL,
  APP_GITHUB_REPORT_ISSUE_URL,
  APP_GITHUB_URL,
} from '../../constants/global';

import { styles } from './Styles.css';

const publicMenu = [
  {
    name: 'home',
    label: 'Home',
    href: LANDING_ROUTE,
    icon: <HomeIcon />,
  },
];

const extraMenu = [
  {
    name: 'github',
    label: 'Github',
    href: APP_GITHUB_URL,
    target: '_blank',
    icon: ({ classes }) => {
      return (
        <img className={classes.sideMenuIcon} alt="Link to GitHub project" src={gitHub}/>
      );
    },
  },
  {
    name: 'reportIssue',
    label: 'Report an issue',
    icon: <BugReportIcon />,
    href: APP_GITHUB_REPORT_ISSUE_URL,
    target: '_blank',
  },
  {
    name: 'featureRequest',
    label: 'Request a feature',
    icon: <FeatureRequestIcon />,
    href: APP_GITHUB_FEATURE_REQUEST_URL,
    target: '_blank',
  },
];

const adminMenu = [
  {
    name: 'myStories',
    label: 'My stories',
    href: ADMIN_STORIES_ROUTE,
    icon: <ViewStoryIcon />,
  },
  {
    name: 'profile',
    label: 'Profile',
    href: ADMIN_PROFILE_ROUTE,
    icon: <UserIcon />,
  },
];

const AuthRequiredListItem = withAuthCmp(ListItem);

@inject('appStore')
@observer
class SideMenu extends Component {
  onItemClick = (history, item) => (ev) => {
    this.props.onHandleDrawerClose();
    history.push(item.href);
    ev.preventDefault();
  };

  renderAppLogo = () => {
    const { classes, onHandleDrawerClose } = this.props;

    return (
      <div className={classes.logoContainer}>
        <img
          alt="Time Travelers Anonymous logo"
          src={ttaLogo}
          className={classes.logoImg}
        />
        <IconButton
          id="closeSideMenu"
          color="secondary"
          className={classes.sideMenuCloseBtn}
          onClick={onHandleDrawerClose}
        >
          <ArrowBack/>
        </IconButton>
      </div>
    );
  };

  renderItem = (item) => {
    const icon = typeof item.icon === 'function'
      ? item.icon(this.props)
      : item.icon;

    const Item = withRouter(({ history }) => (
      <ListItem
        key={item.name}
        button
        component="a"
        href={item.href}
        target={item.target || '_self'}
        {...(item.target !== '_blank'
          ? { onClick: this.onItemClick(history, item) }
          : {}
        )}
      >
        {item.icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={item.label} />
      </ListItem>
    ));

    return <Item key={item.name} />;
  };

  renderAdminMenu = () => {
    const { appStore: { isLoggedIn } } = this.props;
    if (!isLoggedIn) {
      return (
        <AuthRequiredListItem button>
          <ListItemIcon>
            <InfoIcon/>
          </ListItemIcon>
          <ListItemText primary="Log in to use additional features"/>
        </AuthRequiredListItem>
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
          {this.renderAppLogo()}
          <Divider />
          <List>
            {publicMenu.map(this.renderItem)}
          </List>
          <Divider />
          <List>
            {this.renderAdminMenu()}
          </List>
          <Divider />
          <List>
            {extraMenu.map(this.renderItem)}
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
