import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Header from '../components/layout/header/Header';
import classNames from 'classnames';
import Drawer from '../components/layout/Drawer';
import { styles } from '../components/layout/Styles';

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
      return (
        <div className={classes.root}>
          <Header
            drawerOpen={this.state.drawerOpen}
            onHandleDrawerOpened={this.handleDrawerOpen}
          />
          <Drawer
            open={this.state.drawerOpen}
            onHandleDrawerClose={this.handleDrawerClose}
          />
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: this.state.drawerOpen,
            })}
          >
            <div className={classes.drawerHeader} />
            <InnerComponent {...this.props} />
          </main>
        </div>
      );
    }
  });
}
