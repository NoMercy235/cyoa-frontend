import React, { Component, Fragment } from 'react';
import SaveAttributeModal from '../modals/save-attribute/SaveAttributeModal';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

class NewAttribute extends Component {
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
        <Tooltip title="New story">
          <IconButton
            onClick={this.onShowModal}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <SaveAttributeModal
          open={this.state.modalOpen}
          onClose={this.onHideModal}
        />
      </Fragment>
    );
  }
}

NewAttribute.propTypes = {
};

export default NewAttribute;
