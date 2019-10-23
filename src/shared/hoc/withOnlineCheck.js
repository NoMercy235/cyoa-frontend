import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Tooltip, Typography, withStyles } from '@material-ui/core';

import { appStorePropTypes } from '../store/AppStore';

const styles = () => ({
  disabled: {
    cursor: 'not-allowed'
  },
});

export default function withOnlineCheck(WrappedCmp) {
  @inject('appStore')
  @observer
  class OnlineCheckedComponent extends Component {
    static defaultProps = {
      propName: 'disabled',
    };

    renderTooltip = () => {
      return (
        <Typography
          variant={'h6'}
          color="inherit"
        >
          Not available in offline mode
        </Typography>
      );
    };

    getNewProps = () => {
      const newProps = Object.assign({}, this.props);
      delete newProps.staticContext;
      delete newProps.appStore;
      delete newProps.propName;
      return newProps;
    };

    renderWrappedCmp = () => {
      const {
        appStore,
        propName,
        children,
      } = this.props;

      const options = { [propName]: !appStore.onlineStatus };

      return (
        <WrappedCmp
          { ...this.getNewProps() }
          { ...options }
        >
          {children}
        </WrappedCmp>
      );
    };

    renderDisabledWrappedCmp = () => {
      const { classes } = this.props;

      return (
        <Tooltip title={this.renderTooltip()}>
          <div
            className={classes.disabled}
            { ...this.getNewProps() }
            // The onClick event will be overwritten here for disabled components
            onClick={() => {}}
          >
            {this.renderWrappedCmp()}
          </div>
        </Tooltip>
      );
    };

    render() {
      const { appStore } = this.props;

      return appStore.onlineStatus
        ? this.renderWrappedCmp()
        : this.renderDisabledWrappedCmp();
    }
  }

  OnlineCheckedComponent.propTypes = {
    propName: PropTypes.string,

    appStore: appStorePropTypes,
  };

  return withStyles(styles)(OnlineCheckedComponent);
}
