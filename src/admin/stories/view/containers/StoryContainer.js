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
  async fetchStories(filters) {
    const stories = (await storyService.list(filters)).map(s => new StoryModel(s));
    this.props.storyStore.setStories(stories);
  }

  async fetchCollections(filters) {
    const collections = (await collectionService.list(filters)).map(c => new CollectionModel(c));
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

  componentDidMount () {
    this.fetchCollections();
    this.fetchStories(this.getStoryFilter(''));
  }

  render() {
    const { stories, collections } = this.props.storyStore;

    return (
      <Fragment>
        <div className={classes.tableContainer}>
          <div className={classes.collectionsContainer}>
            <ActionBar>
              <NewCollection />
            </ActionBar>
            {!!collections.length &&
              <CollectionsTableCmp
                collections={collections}
                onChangeCollection={this.onChangeCollection}
              />
            }
          </div>
          <div className={classes.storiesContainer}>
            <ActionBar>
              <NewStory />
            </ActionBar>
            {!!stories.length &&
              <StoriesTableCmp stories={stories}/>
            }
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
