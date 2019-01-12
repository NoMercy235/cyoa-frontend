import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import SaveStoryModal from '../modals/save-story/SaveStoryModal';

class NewStory extends Component {
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
          New story
        </Button>

        <SaveStoryModal
          open={this.state.modalOpen}
          onClose={this.onHideModal}
        />
      </Fragment>
    );
  }
}

NewStory.propTypes = {
};

export default NewStory;
