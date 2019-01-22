import React, { Component, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import * as PropTypes from 'prop-types';
import SaveStoryModal from '../modals/save-story/SaveStoryModal';
import { StoryModel } from '../../../domain/models/StoryModel';

class EditStory extends Component {
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
        <IconButton
          onClick={this.onShowModal}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <SaveStoryModal
          open={this.state.modalOpen}
          onClose={this.onHideModal}
          story={this.props.story}
        />
      </Fragment>
    );
  }
}

EditStory.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
};

export default EditStory;
