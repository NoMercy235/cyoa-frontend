import React, { Component, Fragment } from 'react';
import CollectionsTableCmp from '../components/tables/CollectionsTableCmp';
import StoriesTableCmp from '../components/tables/StoriesTableCmp';
import classes from '../../style/StoryContainer.module.scss';
import { storyService } from '../../../../infrastructure/services/StoryService';
import { inject, observer } from 'mobx-react';
import { storyStorePropTypes } from '../../stores/StoryStore';
import { collectionService } from '../../../../infrastructure/services/CollectionService';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';
import { withSnackbar } from '../../../../shared/components/form/helpers';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';

@inject('storyStore')
@observer
class StoryContainer extends Component {
  state = {
    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

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
    await withSnackbar.call(
      this,
      collectionService.delete,
      [colId],
      'Collection deleted'
    );
    this.props.storyStore.removeCollection(colId);
  };

  onDeleteStory = async storyId => {
    await withSnackbar.call(
      this,
      storyService.delete,
      [storyId],
      'Story deleted'
    );
    this.props.storyStore.removeStory(storyId);
  };

  componentDidMount () {
    this.fetchCollections();
    this.fetchStories(this.getStoryFilter(''));
  }

  render() {
    const { stories, collections } = this.props.storyStore;

    return (
      <Fragment>
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
        <Snackbar
          open={this.state.open}
          onClose={this.onChangeState({ open: false })}
          message={this.state.message}
          variant={this.state.variant}
        />
      </Fragment>
    );
  }
}

StoryContainer.propTypes = {
  storyStore: storyStorePropTypes,
};

export default StoryContainer;
