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

  @action addStory(story) {
    this.stories.push(story);
  }

  @action setCollections(collections) {
    this.collections = collections;
  }

  @action addCollection(collection) {
    this.collections.push(collection);
  }
}

export const storyStorePropTypes = PropTypes.shape({
  stories: PropTypes.arrayOf(PropTypes.shape(StoryModel)),
  collections: PropTypes.arrayOf(PropTypes.shape(CollectionModel)),

  setStories: PropTypes.func,
  addStory: PropTypes.func,
  setCollections: PropTypes.func,
});


export const storyStore = new StoryStore();
