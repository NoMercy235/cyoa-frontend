import React, { Component, Fragment } from 'react';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';
import SaveSequenceModal from '../modals/save-sequence/SaveSequenceModal';

class NewSequence extends Component {
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
        <Tooltip title="New sequence">
          <IconButton
            onClick={this.onShowModal}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <SaveSequenceModal
          open={this.state.modalOpen}
          onClose={this.onHideModal}
        />
      </Fragment>
    );
  }
}

NewSequence.propTypes = {
};

export default NewSequence;
