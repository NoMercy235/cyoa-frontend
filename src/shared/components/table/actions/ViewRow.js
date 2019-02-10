import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import * as PropTypes from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

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
