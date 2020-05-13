import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Button } from '@material-ui/core';

import { storyService } from '../../../infrastructure/services/StoryService';
import { StoryModel } from '../../../infrastructure/models/StoryModel';
import { storyViewStorePropTypes } from '../../../admin/story-view/stores/StoryViewStore';
import { withModal } from '../../hoc/withModal';
import { BACKEND_ERRORS } from '../../constants/errors';
import { appStorePropTypes } from '../../store/AppStore';
import { makePath, READ_STORY_ROUTE } from '../../constants/routes';

import styles from './PublishBtn.module.scss';

const HOCButton = withModal(Button);

@inject('storyViewStore', 'appStore')
@observer
class PublishBtn extends Component {
  static defaultProps = {
    withTryStoryBtn: true,
  };

  state = { errors: [] };

  onTryStoryClick = () => {
    const { story } = this.props;
    window.open(makePath(`${READ_STORY_ROUTE}?isPreview=true`, { ':storyId': story._id }), "_blank")
  };

  onCheckIfCanPublish = async () => {
    const { story } = this.props;
    try {
      await storyService.checkIfCanPublish(story._id);
      return true;
    } catch (e) {
      this.setState({ errors: Object.keys(e) });
      return false;
    }
  };

  resetErrors = () => {
    this.setState({ errors: [] });
  };

  onChangePublishState = (published, message) => async () => {
    const { story, onPublishStateChanged, appStore } = this.props;
    const dbStory = await storyService.publish(story._id, published);
    await onPublishStateChanged(dbStory);
    appStore.showSuccessSnackbar({ message });
  };

  renderErrors = () => {
    const { errors } = this.state;

    if (!errors.length) return null;

    return (
      <>
        <span className={styles.publishBtnErrors}>Encountered the following errors:</span>
        <ul className={styles.publishBtnErrors}>
          {errors.map((err, i) => {
            return <li key={i}>{BACKEND_ERRORS[err]}</li>;
          })}
        </ul>
      </>
    );
  };

  renderPublishDescription = () => {
    return (
      <>
        <span>Please note the following:</span>
        <ul>
          <li>If the player should be able to lose the story, at least one important attribute is needed</li>
          <li>You need to have marked one sequence as a starting sequence</li>
          <li>You need at least one sequence marked as ending sequence </li>
        </ul>
        {this.renderErrors()}
      </>
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
        onShowModal={this.resetErrors}
        onModalSubmit={this.onChangePublishState(true, 'Story has been published!')}
        onPreCondition={this.onCheckIfCanPublish}
      >
        Publish
      </HOCButton>
    );
  };

  renderUnpublishDescription = () => {
    return (
      <>
        <span>Please note the following:</span>
        <ul>
          <li>The story will not be accessible to anyone, even if they have the link to it</li>
          <li>Any players associated to the story will be deleted</li>
        </ul>
      </>
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
        onModalSubmit={this.onChangePublishState(false, 'Story has been unpublished!')}
      >
        Unpublish
      </HOCButton>
    );
  };

  render() {
    const { story, withTryStoryBtn } = this.props;

    return (
      <>
        {withTryStoryBtn && (
          <Button
            className={styles.tryStoryBtn}
            color="secondary"
            onClick={this.onTryStoryClick}
          >
            Try story
          </Button>
        )}
        {story.published
          ? this.renderUnpublishButton()
          : this.renderPublishButton()
        }
      </>
    );
  }
}

PublishBtn.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
  onPublishStateChanged: PropTypes.func.isRequired,
  withTryStoryBtn: PropTypes.bool,

  storyViewStore: storyViewStorePropTypes,
  appStore: appStorePropTypes,
};

export default PublishBtn;
