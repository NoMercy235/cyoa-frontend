import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import SaveAttributeModal from '../modals/save-attribute/SaveAttributeModal';

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
        <Button
          variant="contained"
          color="primary"
          onClick={this.onShowModal}
        >
          New attribute
        </Button>

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
