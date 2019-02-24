import React, { Component, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import * as PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

class BasicEditAction extends Component {
  state = {
    modalOpen: false,
    resource: this.props.resource || {},
  };

  onShowModal = async () => {
    const { getBeforeModal } = this.props;

    let resource = this.props.resource;
    if (this.props.getBeforeModal) {
      resource = await getBeforeModal(resource);
    }

    this.setState({ modalOpen: true, resource });
  };

  onHideModal = () => {
    this.setState({ modalOpen: false, resource: null });
  };

  render() {
    const ModalComponent = this.props.modalComponent;
    const resourceProp = {
      [this.props.resourceName]: this.state.resource,
    };

    return (
      <Fragment>
        <IconButton
          onClick={this.onShowModal}
        >
          <Tooltip title={this.props.tooltip || 'Edit'}>
            <EditIcon fontSize="small" />
          </Tooltip>
        </IconButton>
        <ModalComponent
          open={this.state.modalOpen}
          onClose={this.onHideModal}
          {...resourceProp}
          {...this.props.innerProps}
        />
      </Fragment>
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
};

export default BasicEditAction;
