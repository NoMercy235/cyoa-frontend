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
    const { tooltip, innerProps, modalComponent: ModalComponent } = this.props;
    const { modalOpen } = this.state;
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
          open={modalOpen}
          onClose={this.onHideModal}
          {...(innerProps || {})}
        />
      </Fragment>
    );
  }
}

BasicNewAction.propTypes = {
  tooltip: PropTypes.string.isRequired,
  modalComponent: PropTypes.func.isRequired,
  innerProps: PropTypes.object,
};

export default BasicNewAction;
