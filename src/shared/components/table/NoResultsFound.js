import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

class NoResultsFound extends Component {

  render() {
    const { condition } = this.props;
    const result = typeof condition === 'function'
      ? condition()
      : condition;
    if (!result) return null;

    return (
      <Typography
        variant="h6"
        color="inherit"
        noWrap
      >
        No results found
      </Typography>
    );
  }
}

NoResultsFound.propTypes = {
  condition: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
};

export default NoResultsFound;
