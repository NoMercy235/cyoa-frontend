import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Card, CardActions, CardContent, CardHeader, Divider } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import GeneralTab from '../components/general/GeneralTab';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import PublishBtn from '../components/general/PublishBtn';
import { renderGeneralTitle } from '../components/general/GeneralTitle';
import { storyService } from '../../../../infrastructure/services/StoryService';

import styles from './GeneralTabContainer.module.scss';

@inject('storyViewStore')
@observer
class GeneralTabContainer extends Component {
  onPublishStateChanged = (story) => {
    this.props.storyViewStore.setCurrentStory(story);
  };

  onCoverPicChanged = async (img) => {
    const { story, storyViewStore } = this.props;
    const newStory = await storyService.update(
      story._id,
      StoryModel.forApi({ ...story, coverPic: img }),
    );
    storyViewStore.setCurrentStory(newStory);
  };

  render() {
    const { story } = this.props;

    return (
      <Card className={styles.container}>
        <CardHeader title={renderGeneralTitle(story)}/>
        <CardContent className={styles.content}>
          <GeneralTab
            story={story}
            onCoverPicChanged={this.onCoverPicChanged}
          />
          <Divider className={styles.divider} />
          <div className={styles.publishBtn}>
            <PublishBtn
              story={story}
              onPublishStateChanged={this.onPublishStateChanged}
            />
          </div>
        </CardContent>
        <CardActions disableSpacing>

        </CardActions>
      </Card>
    );
  }
}

GeneralTabContainer.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
};

export default GeneralTabContainer;
