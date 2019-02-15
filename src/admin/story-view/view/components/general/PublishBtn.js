import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { storyService } from '../../../../../infrastructure/services/StoryService';
import { withSnackbar } from '../../../../../shared/components/form/helpers';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { storyViewStorePropTypes } from '../../../stores/StoryViewStore';
import Snackbar from '../../../../../shared/components/snackbar/Snackbar';

@inject('storyViewStore')
@observer
class PublishBtn extends Component {
  state = {
    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  onChangePublishState = (state, message) => async () => {
    const { story } = this.props;
    const dbStory = await withSnackbar.call(
      this,
      storyService.update,
      [story._id, { published: state }],
      message
    );
    this.props.storyViewStore.setCurrentStory(dbStory);
  };

  renderPublishButton = () => {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={this.onChangePublishState(true, 'Story has been published!')}
      >
        Publish
      </Button>
    );
  };

  renderUnpublishButton = () => {
    return (
      <Button
        variant="contained"
        color="secondary"
        onClick={this.onChangePublishState(false, 'Story has been unpublished!')}
      >
        Unpublish
      </Button>
    );
  };

  render() {
    const { story } = this.props;
    const { open, message, variant } = this.state;

    return (
      <Fragment>
        {story.published ? this.renderUnpublishButton() : this.renderPublishButton()}
        <Snackbar
          open={open}
          onClose={this.onChangeState({ open: false })}
          message={message}
          variant={variant}
        />
      </Fragment>
    );
  }
}

PublishBtn.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default PublishBtn;
