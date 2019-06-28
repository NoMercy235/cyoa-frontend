import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Tooltip, Typography } from '@material-ui/core';

import { appStorePropTypes } from '../store/AppStore';

export default function withOnlineCheck(WrappedCmp) {
  @inject('appStore')
  @observer
  class OnlineCheckedComponent extends Component {
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
      return newProps;
    };

    renderWrappedCmp = () => {
      const {
        appStore,
        propName = 'disabled',
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
      return (
        <Tooltip title={this.renderTooltip()}>
          <div { ...this.getNewProps() }>
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
    propName: PropTypes.string.isRequired,

    appStore: appStorePropTypes,
  };

  return OnlineCheckedComponent;
}
