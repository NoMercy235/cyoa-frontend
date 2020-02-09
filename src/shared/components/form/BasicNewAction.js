import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

class BasicNewAction extends Component {
  state = {
    modalOpen: false,
  };

  onShowModal = async () => {
    const { onModalOpen } = this.props;
    onModalOpen && await onModalOpen();
    this.setState({ modalOpen: true });
  };

  onHideModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const {
      className,
      tooltip,
      innerProps,
      modalComponent: ModalComponent,
      disabled,
    } = this.props;
    const { modalOpen } = this.state;
    return (
      <>
        <IconButton
          className={className}
          onClick={this.onShowModal}
          disabled={disabled}
        >
          <Tooltip title={tooltip}>
            <AddIcon fontSize="small" />
          </Tooltip>
        </IconButton>

        <ModalComponent
          open={modalOpen}
          onClose={this.onHideModal}
          {...(innerProps || {})}
        />
      </>
    );
  }
}

BasicNewAction.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.string.isRequired,
  modalComponent: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  innerProps: PropTypes.object,
  onModalOpen: PropTypes.func,
  onModalClose: PropTypes.func,
};

export default BasicNewAction;
