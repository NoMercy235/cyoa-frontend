import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import FiltersContainer from './FiltersContainer';
import NoResultsFound from '../../../../shared/components/table/NoResultsFound';
import StoryBox from '../components/story-box/StoryBox';
import { SnackbarEnum } from '../../../../shared/components/snackbar/Snackbar';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';

import styles from './LandingContainer.module.scss';

@inject('publicStoryStore', 'appStore')
@observer
class LandingContainer extends Component {
  snackbarRef = React.createRef();

  getStories = async filters => {
    const { appStore, publicStoryStore } = this.props;

    const stories = await publicStoryService.list(filters);
    publicStoryStore.setStories(stories);
    // For each story that has been saved offline, update it with new data
    if (appStore.onlineStatus) {
      stories.forEach(async s => {
        const isOffline = await s.isOffline();
        if (isOffline) await s.saveOffline();
      });
    }
  };

  makeStoryAvailableOffline = async (story, isAvailableOffline) => {
    if (isAvailableOffline) {
      await story.saveOffline();
      this.snackbarRef.current.showSnackbar({
        variant: SnackbarEnum.Variants.Success,
        message: 'Story is now available offline',
      });
    } else {
      await story.removeOffline();
      this.snackbarRef.current.showSnackbar({
        variant: SnackbarEnum.Variants.Success,
        message: 'Story no longer available offline',
      });
    }
  };

  componentDidMount () {
    this.getStories();
    this.props.appStore.loadHeader(FiltersContainer);
  }

  componentWillUnmount () {
    this.props.appStore.unloadHeader(FiltersContainer);
  }

  render() {
    const { publicStoryStore: { stories } } = this.props;
    const hasStories = !!stories.length;

    return (
      <>
        <Breadcrumb/>
        <div className={styles.storiesContainer}>
          <NoResultsFound show={!hasStories}/>
          {hasStories && stories.map(s => (
            <StoryBox
              key={s._id}
              story={s}
              makeStoryAvailableOffline={this.makeStoryAvailableOffline}
            />
          ))}
        </div>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

LandingContainer.propTypes = {
  publicStoryStore: publicStoryStorePropTypes,
  appStore: appStorePropTypes,
};

export default LandingContainer;
