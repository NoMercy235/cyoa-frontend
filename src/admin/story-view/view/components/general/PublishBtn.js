import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { storyService } from '../../../../../infrastructure/services/StoryService';
import { withSnackbar } from '../../../../../shared/components/form/helpers';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { storyViewStorePropTypes } from '../../../stores/StoryViewStore';
import Snackbar from '../../../../../shared/components/snackbar/Snackbar';
import { withModal } from '../../../../../shared/hoc/withModal';

const HOCButton = withModal(Button);

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

  renderPublishDescription = () => {
    return (
      <Fragment>
        <span>Please note the following:</span>
        <ul>
          <li>If the player should be able to lose the story, at least one important attribute is needed</li>
          <li>You need to have marked one sequence as a starting sequence</li>
          <li>You need at least one sequence marked as ending sequence </li>
        </ul>
      </Fragment>
    );
  };

  renderPublishButton = () => {
    return (
      <HOCButton
        title="Publish this story?"
        description={this.renderPublishDescription()}
        innerProps={{
          variant: 'contained',
          color: 'primary',
        }}
        onClick={this.onChangePublishState(true, 'Story has been published!')}
      >
        Publish
      </HOCButton>
    );
  };

  renderUnpublishDescription = () => {
    return (
      <Fragment>
        <span>Please note the following:</span>
        <ul>
          <li>Any users currently reading the story will still be able to continue reading it</li>
          <li>Players in possession of the shared link will still be able to access the story</li>
        </ul>
      </Fragment>
    );
  };

  renderUnpublishButton = () => {
    return (
      <HOCButton
        title="Unpublish this story?"
        description={this.renderUnpublishDescription()}
        innerProps={{
          variant: 'contained',
          color: 'secondary',
        }}
        onClick={this.onChangePublishState(false, 'Story has been unpublished!')}
      >
        Unpublish
      </HOCButton>
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
