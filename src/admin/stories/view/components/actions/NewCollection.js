import React, { Component, Fragment } from 'react';
import SaveCollectionModal from '../modals/save-collection/SaveCollectionModal';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

class NewCollection extends Component {
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
        <Tooltip title="New collection">
          <IconButton
            onClick={this.onShowModal}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <SaveCollectionModal
          open={this.state.modalOpen}
          onClose={this.onHideModal}
        />
      </Fragment>
    );
  }
}

NewCollection.propTypes = {
};

export default NewCollection;
