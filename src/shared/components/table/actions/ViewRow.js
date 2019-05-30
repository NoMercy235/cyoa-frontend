import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

class ViewRow extends Component {
  render() {
    const { onClick, tooltip, fontSize } = this.props;

    return (
      <IconButton onClick={onClick}>
        <Tooltip title={tooltip || 'View'}>
          <VisibilityIcon fontSize={fontSize || 'small'} />
        </Tooltip>
      </IconButton>
    );
  }
}

ViewRow.propTypes = {
  fontSize: PropTypes.string,
  tooltip: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default ViewRow;
