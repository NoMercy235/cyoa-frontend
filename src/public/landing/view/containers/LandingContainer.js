import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withRouter } from 'react-router-dom';
import * as queryString from 'query-string';

import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { FiltersType, publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import FiltersContainer from './FiltersContainer';
import NoResultsFound from '../../../../shared/components/table/NoResultsFound';
import StoryBox from '../components/story-box/StoryBox';
import { StoryListEnd } from '../components/story-list-end/StoryListEnd';
import LoadingCmp from '../../../../shared/components/loading/LoadingCmp';
import { LANDING_PAGE_STORIES_CONTAINER_ID } from '../../../../shared/constants/global';

import styles from './LandingContainer.module.scss';
import { Helmet } from 'react-helmet';

@inject('publicStoryStore', 'appStore')
@observer
class LandingContainer extends Component {
  state = {
    initialRequestDone: false,
  };

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
    const { appStore } = this.props;
    if (isAvailableOffline) {
      await story.saveOffline();
      appStore.showSuccessSnackbar({
        message: 'Story is now available offline',
      });
    } else {
      await story.removeOffline();
      appStore.showSuccessSnackbar({
        message: 'Story no longer available offline',
      });
    }
  };

  async componentDidMount () {
    const {
      appStore,
      location: { search },
    } = this.props;

    const qs = queryString.parse(search);

    if (qs.recoverPasswordSuccess) {
      appStore.showSuccessSnackbar({
        message: 'Password successfully changed! Please login to your account.'
      });
    }

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
        <Helmet>
          <title>Rigamo | Choose your own Adventure</title>
        </Helmet>
        <Breadcrumb/>
        <div id={LANDING_PAGE_STORIES_CONTAINER_ID} className={styles.storiesContainer}>
          <NoResultsFound show={initialRequestDone && !hasStories}/>
          {(!initialRequestDone || hasStories) && (
            <InfiniteScroll
              dataLength={stories.length}
              next={this.getNextStories}
              hasMore={!reachedEnd}
              loader={<LoadingCmp/>}
              endMessage={<StoryListEnd/>}
              scrollableTarget={LANDING_PAGE_STORIES_CONTAINER_ID}
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
      </>
    );
  }
}

LandingContainer.propTypes = {
  publicStoryStore: publicStoryStorePropTypes,
  appStore: appStorePropTypes,
};

export default withRouter(LandingContainer);
