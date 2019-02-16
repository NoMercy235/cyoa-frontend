import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import * as PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import { withModal } from '../../../hoc/withModal';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

const IconButtonHOC = withModal(IconButton);

class DeleteRow extends Component {
  render() {
    const { title, description, tooltip, onClick } = this.props;
    return (
      <IconButtonHOC
        title={title}
        description={description}
        onClick={onClick}
      >
        <Tooltip title={tooltip || 'Delete'}>
          <DeleteIcon fontSize="small" />
        </Tooltip>
      </IconButtonHOC>
    );
  }
}

DeleteRow.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default DeleteRow;
