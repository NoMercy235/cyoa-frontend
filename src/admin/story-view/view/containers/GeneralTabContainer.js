import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Card, CardActions, CardContent, CardHeader } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import GeneralTab from '../components/general/GeneralTab';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import PublishBtn from '../components/general/PublishBtn';
import { renderGeneralTitle } from '../components/general/GeneralTitle';

import styles from './GeneralTabContainer.module.scss';

@inject('storyViewStore')
@observer
class GeneralTabContainer extends Component {
  onPublishStateChanged = (story) => {
    this.props.storyViewStore.setCurrentStory(story);
  };

  render() {
    const { story } = this.props;

    return (
      <Card className={styles.container}>
        <CardHeader title={renderGeneralTitle(story)}/>
        <CardContent className={styles.content}>
          <GeneralTab story={story}/>
        </CardContent>
        <CardActions disableSpacing>
          <PublishBtn
            story={story}
            onPublishStateChanged={this.onPublishStateChanged}
          />
        </CardActions>
      </Card>
    );
  }
}

GeneralTabContainer.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
};

export default GeneralTabContainer;
