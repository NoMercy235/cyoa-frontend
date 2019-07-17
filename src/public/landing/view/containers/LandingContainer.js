import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@material-ui/core';

import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { FiltersType, publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import FiltersContainer from './FiltersContainer';
import NoResultsFound from '../../../../shared/components/table/NoResultsFound';
import StoryBox from '../components/story-box/StoryBox';
import { SnackbarEnum } from '../../../../shared/components/snackbar/Snackbar';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';
import { StoryListEnd } from '../components/story-list-end/StoryListEnd';

import styles from './LandingContainer.module.scss';

@inject('publicStoryStore', 'appStore')
@observer
class LandingContainer extends Component {
  state = {
    initialRequestDone: false,
  };
  snackbarRef = React.createRef();

  getQuickStories = async () => {
    const { appStore } = this.props;

    return await publicStoryService.quickList(
      appStore.queryParams.publicStories.custom.quickSearch,
      appStore.queryParams.publicStories,
    );
  };

  getStories = async () => {
    const { appStore } = this.props;

    return await publicStoryService.list(appStore.queryParams.publicStories);
  };

  onNextStories = async () => {
    const { publicStoryStore } = this.props;
    return publicStoryStore.filterType === FiltersType.Quick
      ? await this.getQuickStories()
      : await this.getStories();
  };

  getNextStories = async (nextPage = true) => {
    const { appStore, publicStoryStore } = this.props;

    nextPage && appStore.queryParams.publicStories.nextPage();
    const { stories: nextStories } = await this.onNextStories();

    // If there are fewer items than the imposed limit,
    // then we have reached the end of the dataset.
    if (nextStories.length < appStore.queryParams.publicStories.pagination.limit) {
      publicStoryStore.reachedEnd = true;
    }

    publicStoryStore.addStories(nextStories);

    // We don't care when this happens, so we never wait for it.
    this.updateOfflineStories(nextStories);
  };

  updateOfflineStories = async stories => {
    const { appStore } = this.props;

    if (appStore.onlineStatus) {
      // For each story that has been saved offline, update it with new data
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

  async componentDidMount () {
    const { appStore } = this.props;

    appStore.loadHeader(FiltersContainer);
    await this.getNextStories(false);
    this.setState({
      initialRequestDone: true,
    });
  }

  componentWillUnmount () {
    const { appStore, publicStoryStore } = this.props;
    appStore.unloadHeader(FiltersContainer);
    appStore.queryParams.publicStories.reset();
    publicStoryStore.reset();
  }

  render() {
    const {
      publicStoryStore: {
        reachedEnd,
        stories
      },
    } = this.props;
    const { initialRequestDone } = this.state;
    const hasStories = !!stories.length;

    return (
      <>
        <Breadcrumb/>
        <div id="storiesContainer" className={styles.storiesContainer}>
          <NoResultsFound show={initialRequestDone && !hasStories}/>
          {(!initialRequestDone || hasStories) && (
              <InfiniteScroll
              dataLength={stories.length}
              next={this.getNextStories}
              hasMore={!reachedEnd}
              loader={<CircularProgress/>}
              endMessage={<StoryListEnd/>}
              scrollableTarget="storiesContainer"
            >
              {stories.map(s => (
                <StoryBox
                  key={s._id}
                  story={s}
                  makeStoryAvailableOffline={this.makeStoryAvailableOffline}
                />
              ))}
            </InfiniteScroll>
          )}
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
