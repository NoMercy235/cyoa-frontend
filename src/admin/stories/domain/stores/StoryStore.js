import { observable, action } from 'mobx';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../models/StoryModel';
import { CollectionModel } from '../models/CollectionModel';

class StoryStore {
  @observable stories = [];
  @observable collections = [];

  @action setStories(stories) {
    this.stories = stories;
  }

  @action setCollections(collections) {
    this.collections = collections;
  }
}

export const storyStorePropTypes = PropTypes.shape({
  stories: PropTypes.arrayOf(PropTypes.shape(StoryModel)),
  collections: PropTypes.arrayOf(PropTypes.shape(CollectionModel)),

  setStories: PropTypes.func,
  setCollections: PropTypes.func,
});


export const storyStore = new StoryStore();
