import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button, Switch } from '@material-ui/core';

import withDisabledStoryPublished from '../../../../../../shared/hoc/withDisabledStoryPublished';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import PublishBtn from '../../../../../../shared/components/publish-btn/PublishBtn';

import styles from './ActionsToolbarComponent.module.scss';

const BtnWithDisabledState = withDisabledStoryPublished(Button);

class ActionsToolbarComponent extends Component {
  onAddNewSequenceModalOpen = () => {
    this.props.onAddNewSequenceModalOpen();
  };

  onAddNewOptionModalOpen = () => {
    this.props.onAddNewOptionModalOpen();
  };

  render () {
    const {
      story,
      isPreviewEnabled,
      onPreviewEnabledChange,
      onStoryPublishStateChanged,
    } = this.props;

    return (
      <div className={styles.toolbarContainer}>
        <BtnWithDisabledState
          className={styles.newSequenceBtn}
          onClick={this.onAddNewSequenceModalOpen}
          variant="outlined"
          color="primary"
        >
          New Sequence
        </BtnWithDisabledState>
        <BtnWithDisabledState
          onClick={this.onAddNewOptionModalOpen}
          variant="outlined"
          color="primary"
        >
          New Option
        </BtnWithDisabledState>
        <div className={styles.divider}/>
        <PublishBtn
          story={story}
          onPublishStateChanged={onStoryPublishStateChanged}
        />
        <div>
          Allow preview?
          <Switch
            value={isPreviewEnabled}
            checked={isPreviewEnabled}
            onChange={onPreviewEnabledChange}
          />
        </div>
      </div>
    );
  }
}

ActionsToolbarComponent.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  isPreviewEnabled: PropTypes.bool.isRequired,

  onPreviewEnabledChange: PropTypes.func.isRequired,
  onAddNewSequenceModalOpen: PropTypes.func.isRequired,
  onAddNewOptionModalOpen: PropTypes.func.isRequired,
  onStoryPublishStateChanged: PropTypes.func.isRequired,
};

export default ActionsToolbarComponent;
