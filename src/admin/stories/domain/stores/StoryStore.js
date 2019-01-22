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

  @action updateStory(id, newStory) {
    this.stories = this.stories.map(c => {
      if (c._id !== id) return c;
      return newStory;
    });
  }

  @action removeStory(storyId) {
    this.stories = this.stories.filter(c => c._id !== storyId);
  }

  @action setCollections(collections) {
    this.collections = collections;
  }

  @action addCollection(collection) {
    this.collections.push(collection);
  }

  @action updateCollection(id, newCollection) {
    this.collections = this.collections.map(c => {
      if (c._id !== id) return c;
      return newCollection;
    });
  }

  @action removeCollection(colId) {
    this.collections = this.collections.filter(c => c._id !== colId);
  }
}

export const storyStorePropTypes = PropTypes.shape({
  stories: PropTypes.arrayOf(PropTypes.shape(StoryModel)),
  collections: PropTypes.arrayOf(PropTypes.shape(CollectionModel)),

  setStories: PropTypes.func,
  addStory: PropTypes.func,
  removeStory: PropTypes.func,
  setCollections: PropTypes.func,
  removeCollection: PropTypes.func,
});


export const storyStore = new StoryStore();
