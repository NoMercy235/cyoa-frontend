import React, { Component, Fragment } from 'react';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import * as PropTypes from 'prop-types';

class BasicNewAction extends Component {
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
    const ModalComponent = this.props.modalComponent;
    const { tooltip } = this.props;

    return (
      <Fragment>
        <Tooltip title={tooltip}>
          <IconButton
            onClick={this.onShowModal}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <ModalComponent
          open={this.state.modalOpen}
          onClose={this.onHideModal}
        />
      </Fragment>
    );
  }
}

BasicNewAction.propTypes = {
  tooltip: PropTypes.string.isRequired,
  modalComponent: PropTypes.func.isRequired,
};

export default BasicNewAction;
