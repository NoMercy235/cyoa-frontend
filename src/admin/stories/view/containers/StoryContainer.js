import React, { Component, Fragment } from 'react';
import CollectionsTableCmp from '../components/tables/CollectionsTableCmp';
import StoriesTableCmp from '../components/tables/StoriesTableCmp';
import classes from '../../style/StoryContainer.module.scss';
import { storyService } from '../../domain/services/StoryService';
import { inject, observer } from 'mobx-react';
import { storyStorePropTypes } from '../../domain/stores/StoryStore';
import { StoryModel } from '../../domain/models/StoryModel';
import NewStory from '../components/actions/NewStory';
import ActionBar from '../../../../shared/components/ActionBar';
import NewCollection from '../components/actions/NewCollection';
import { collectionService } from '../../domain/services/CollectionService';
import { CollectionModel } from '../../domain/models/CollectionModel';

@inject('storyStore')
@observer
class StoryContainer extends Component {
  async fetchStories() {
    const stories = (await storyService.list()).map(s => new StoryModel(s));
    this.props.storyStore.setStories(stories);
  }

  async fetchCollections() {
    const collections = (await collectionService.list()).map(c => new CollectionModel(c));
    this.props.storyStore.setCollections(collections);
  }

  componentDidMount () {
    this.fetchStories();
    this.fetchCollections();
  }

  render() {
    return (
      <Fragment>
        <div className={classes.tableContainer}>
          <div className={classes.collectionsContainer}>
            <ActionBar>
              <NewCollection />
            </ActionBar>
            <CollectionsTableCmp collections={this.props.storyStore.collections} />
          </div>
          <div className={classes.storiesContainer}>
            <ActionBar>
              <NewStory />
            </ActionBar>
            <StoriesTableCmp stories={this.props.storyStore.stories} />
          </div>
        </div>
      </Fragment>
    );
  }
}

StoryContainer.propTypes = {
  storyStore: storyStorePropTypes,
};

export default StoryContainer;
