import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import * as PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

class BasicEditAction extends Component {
  state = {
    modalOpen: false,
    resource: this.props.resource || {},
  };

  onShowModal = async (event) => {
    event.stopPropagation();
    const { getBeforeModal, onModalOpen } = this.props;

    onModalOpen && await onModalOpen();

    let resource = this.props.resource;
    if (getBeforeModal) {
      resource = await getBeforeModal(resource);
    }

    this.setState({ modalOpen: true, resource });
  };

  onHideModal = () => {
    this.setState({ modalOpen: false, resource: null });
  };

  render() {
    const { modalComponent, resourceName, tooltip, innerProps } = this.props;
    const { resource, modalOpen } = this.state;

    const ModalComponent = modalComponent;
    const resourceProp = {
      [resourceName]: resource,
    };

    return (
      <>
        <IconButton
          onClick={this.onShowModal}
        >
          <Tooltip title={tooltip || 'Edit'}>
            <EditIcon fontSize="small" />
          </Tooltip>
        </IconButton>
        <ModalComponent
          open={modalOpen}
          onClose={this.onHideModal}
          {...resourceProp}
          {...innerProps}
        />
      </>
    );
  }
}

BasicEditAction.propTypes = {
  innerProps: PropTypes.object,
  resourceName: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  tooltip: PropTypes.string,
  modalComponent: PropTypes.func.isRequired,
  getBeforeModal: PropTypes.func,
  onModalOpen: PropTypes.func,
  onModalClose: PropTypes.func,
};

export default BasicEditAction;
