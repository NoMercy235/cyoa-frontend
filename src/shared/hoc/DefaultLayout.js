import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Header from '../layout/Header';
import classNames from 'classnames';
import Drawer from '../layout/Drawer';
import { styles } from '../layout/Styles';

export function withDefaultLayout(InnerComponent) {
  return withStyles(styles)(class DefaultLayout extends Component {
    state = {
      open: false,
    };

    handleDrawerOpen = () => {
      this.setState({ open: true });
    };


    handleDrawerClose = () => {
      this.setState({ open: false });
    };

    render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <Header
            open={this.state.open}
            onHandleDrawerOpened={this.handleDrawerOpen}
          />
          <Drawer
            open={this.state.open}
            onHandleDrawerClose={this.handleDrawerClose}
          />
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: this.state.open,
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
