import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import SaveCollectionModal from '../modals/save-collection/SaveCollectionModal';

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
        <Button
          variant="contained"
          color="primary"
          onClick={this.onShowModal}
        >
          New collection
        </Button>

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
