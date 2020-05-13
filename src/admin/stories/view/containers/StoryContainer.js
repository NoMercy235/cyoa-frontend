import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import CollectionsTableCmp from '../components/collections/collections-table/CollectionsTableCmp';
import StoriesTableCmp from '../components/stories/stories-table/StoriesTableCmp';
import { storyService } from '../../../../infrastructure/services/StoryService';
import { storyStorePropTypes } from '../../stores/StoryStore';
import { collectionService } from '../../../../infrastructure/services/CollectionService';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';

import classes from './StoryContainer.module.scss';
import { appStorePropTypes } from '../../../../shared/store/AppStore';

@inject('storyStore', 'appStore')
@observer
class StoryContainer extends Component {
  async fetchStories(filters) {
    const stories = (await storyService.list(filters));
    this.props.storyStore.setStories(stories);
  }

  async fetchCollections(filters) {
    const collections = (await collectionService.list(filters));
    this.props.storyStore.setCollections(collections);
  }

  getStoryFilter(value) {
    return {
      fromCollection: {
        op: 'equals',
        value,
        options: {
          allowEmpty: true,
        },
      },
    };
  }

  onChangeCollection = (colId) => {
    this.props.storyStore.setSelectedCollection(colId);
    this.fetchStories(this.getStoryFilter(colId));
  };

  onDeleteCollection = async (colId) => {
    const { storyStore, appStore } = this.props;
    await collectionService.delete(colId);
    storyStore.removeCollection(colId);
    appStore.showSuccessSnackbar({
      message: 'Collection deleted!',
    });
  };

  onStorySaved = (story) => {
    const { storyStore } = this.props;

    if (story.fromCollection === storyStore.selectedCollection) {
      this.fetchStories(this.getStoryFilter(story.fromCollection));
    } else {
      this.onChangeCollection(story.fromCollection);
    }
  };

  onDeleteStory = async storyId => {
    const { storyStore, appStore } = this.props;
    await storyService.delete(storyId);
    storyStore.removeStory(storyId);
    appStore.showSuccessSnackbar({
      message: 'Story deleted!',
    });
  };

  componentDidMount () {
    this.fetchCollections();
    this.fetchStories(this.getStoryFilter(''));
  }

  componentWillUnmount () {
    this.props.storyStore.reset();
  }

  render() {
    const {
      storyStore: {
        stories,
        collections,
        selectedCollection
      }
    } = this.props;

    return (
      <>
        <Helmet>
          <title>Rigamo | Admin stories</title>
        </Helmet>
        <Breadcrumb/>
        <div className={classes.tableContainer}>
          <div className={classes.collectionsContainer}>
            <CollectionsTableCmp
              collections={collections}
              selectedCollection={selectedCollection}
              onChangeCollection={this.onChangeCollection}
              onDeleteCollection={this.onDeleteCollection}
            />
          </div>
          <div className={classes.storiesContainer}>
            <StoriesTableCmp
              stories={stories}
              onStorySaved={this.onStorySaved}
              onDeleteStory={this.onDeleteStory}
            />
          </div>
        </div>
      </>
    );
  }
}

StoryContainer.propTypes = {
  storyStore: storyStorePropTypes,
  appStore: appStorePropTypes,
};

export default StoryContainer;
