import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MUIDrawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import { styles } from './Styles.css';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import { ADMIN_STORIES_ROUTE } from '../../constants/routes';
import ViewStoryIcon from '@material-ui/icons/Pageview';

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
    condition: (appStore) => appStore.isLoggedIn,
  },
];

@inject('appStore')
@observer
class Drawer extends Component {
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

  render() {
    const { classes, appStore, open, onHandleDrawerClose } = this.props;

    return (
      <Fragment>
        <MUIDrawer
          open={open}
          onClose={onHandleDrawerClose}
          classes={{ paper: classes.drawer }}
        >
          <div className={classes.drawerHeader}>
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
            {adminMenu
              .filter(item => item.condition(appStore))
              .map(this.renderItem)}
          </List>
        </MUIDrawer>
      </Fragment>
    );
  }
}

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onHandleDrawerClose: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles)(Drawer);
