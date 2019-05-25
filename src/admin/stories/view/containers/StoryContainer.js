import React, { Component } from 'react';
import CollectionsTableCmp from '../components/collections/collections-table/CollectionsTableCmp';
import StoriesTableCmp from '../components/stories/stories-table/StoriesTableCmp';
import classes from './StoryContainer.module.scss';
import { storyService } from '../../../../infrastructure/services/StoryService';
import { inject, observer } from 'mobx-react';
import { storyStorePropTypes } from '../../stores/StoryStore';
import { collectionService } from '../../../../infrastructure/services/CollectionService';
import Snackbar, { SnackbarEnum } from '../../../../shared/components/snackbar/Snackbar';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';

@inject('storyStore')
@observer
class StoryContainer extends Component {
  snackbarRef = React.createRef();

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
    this.fetchStories(this.getStoryFilter(colId));
  };

  onDeleteCollection = async (colId) => {
    await this.snackbarRef.current.executeAndShowSnackbar(
      collectionService.delete,
      [colId],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Collection deleted!',
      },
    );
    this.props.storyStore.removeCollection(colId);
  };

  onDeleteStory = async storyId => {
    await this.snackbarRef.current.executeAndShowSnackbar(
      storyService.delete,
      [storyId],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Story deleted!',
      },
    );
    this.props.storyStore.removeStory(storyId);
  };

  componentDidMount () {
    this.fetchCollections();
    this.fetchStories(this.getStoryFilter(''));
  }

  componentWillUnmount () {
    this.props.storyStore.reset();
  }

  render() {
    const { stories, collections } = this.props.storyStore;

    return (
      <>
        <Breadcrumb/>
        <div className={classes.tableContainer}>
          <div className={classes.collectionsContainer}>
            <CollectionsTableCmp
              collections={collections}
              onChangeCollection={this.onChangeCollection}
              onDeleteCollection={this.onDeleteCollection}
            />
          </div>
          <div className={classes.storiesContainer}>
            <StoriesTableCmp
              stories={stories}
              onDeleteStory={this.onDeleteStory}
            />
          </div>
        </div>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

StoryContainer.propTypes = {
  storyStore: storyStorePropTypes,
};

export default StoryContainer;
