import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import * as PropTypes from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

class ViewRow extends Component {
  render() {
    return (
      <IconButton onClick={this.props.onClick}>
        <Tooltip title={this.props.tooltip || 'View'}>
          <VisibilityIcon fontSize="small" />
        </Tooltip>
      </IconButton>
    );
  }
}

ViewRow.propTypes = {
  tooltip: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default ViewRow;
