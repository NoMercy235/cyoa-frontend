import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Typography, CircularProgress } from '@material-ui/core';
import classNames from 'classnames';

import classes from './LoadingCmp.module.scss';

class LoadingCmp extends Component {
  render() {
    const {
      className,
      text,
      textVariant,
      thickness,
      size,
    } = this.props;

    return (
      <div className={classNames(classes.container, className)}>
        <Typography variant={textVariant || 'subtitle1'}>
          {text || 'Loading...'}
        </Typography>
        <CircularProgress
          thickness={thickness}
          size={size}
        />
      </div>
    );
  }
}

LoadingCmp.propTypes = {
  className: PropTypes.string,
  thickness: PropTypes.number,
  size: PropTypes.number,
  text: PropTypes.string,
  textVariant: PropTypes.string,
};

export default LoadingCmp;
