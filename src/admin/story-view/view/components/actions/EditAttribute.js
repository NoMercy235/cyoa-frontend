import React, { Component, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import * as PropTypes from 'prop-types';
import { AttributeModel } from '../../../domain/models/AttributeModel';
import SaveAttributeModal from '../modals/save-attribute/SaveAttributeModal';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

class EditAttribute extends Component {
  state = {
    modalOpen: false,
  };

  onShowModal = () => {
    this.setState({ modalOpen: true });
  };

  onHideModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    return (
      <Fragment>
        <IconButton
          onClick={this.onShowModal}
        >
          <Tooltip title="Edit">
            <EditIcon fontSize="small" />
          </Tooltip>
        </IconButton>
        <SaveAttributeModal
          open={this.state.modalOpen}
          onClose={this.onHideModal}
          attribute={this.props.attribute}
        />
      </Fragment>
    );
  }
}

EditAttribute.propTypes = {
  attribute: PropTypes.instanceOf(AttributeModel).isRequired,
};

export default EditAttribute;
