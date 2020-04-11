import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import { Tooltip } from '@material-ui/core';

export default function withDisabledBtn (WrappedCmp) {
  class DisabledComponent extends Component {
    static defaultProps = {
      propName: 'disabled',
    };

    getCondition = () => {
      const { condition } = this.props;
      return typeof condition === 'function'
        ? condition()
        : condition;
    };

    getNewProps = () => {
      const {
        storyViewStore,
        staticContext,
        propName,
        condition,
        ...newProps
      } = this.props;
      return newProps;
    };

    renderWrappedCmp = () => {
      const {
        propName,
        children,
      } = this.props;

      const options = { [propName]: this.getCondition() };

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
      const { reason } = this.props;

      return (
        <Tooltip title={reason}>
          <span>
            {this.renderWrappedCmp()}
          </span>
        </Tooltip>
      );
    };

    render() {
      return this.getCondition()
        ? this.renderDisabledWrappedCmp()
        : this.renderWrappedCmp();
    }
  }

  DisabledComponent.propTypes = {
    propName: PropTypes.string,
    reason: PropTypes.string.isRequired,
    condition: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
  };


  return DisabledComponent;
}
