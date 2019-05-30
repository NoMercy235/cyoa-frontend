import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Header from '../components/layout/header/Header';
import Drawer from '../components/layout/SideMenu';
import { styles } from '../components/layout/Styles.css';

export function withDefaultLayout(InnerComponent) {
  return withStyles(styles)(class DefaultLayout extends Component {
    state = {
      drawerOpen: false,
    };

    handleDrawerOpen = () => {
      this.setState({ drawerOpen: true });
    };


    handleDrawerClose = () => {
      this.setState({ drawerOpen: false });
    };

    render() {
      const { classes } = this.props;
      const { drawerOpen } = this.state;

      return (
        <div className={classes.root}>
          <Header
            onHandleDrawerOpened={this.handleDrawerOpen}
          />
          <Drawer
            open={drawerOpen}
            onHandleDrawerClose={this.handleDrawerClose}
          />
          <main
            className={classes.content}
          >
            <div className={classes.drawerHeader} />
            <InnerComponent {...this.props} />
          </main>
        </div>
      );
    }
  });
}
