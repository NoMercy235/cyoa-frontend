import { observable, action, runInAction, computed } from 'mobx';
import * as PropTypes from 'prop-types';

import { StoryModel } from '../../../infrastructure/models/StoryModel';
import { CollectionModel } from '../../../infrastructure/models/CollectionModel';

class StoryStore {
  @observable stories = [];
  @observable collections = [];
  @observable selectedCollection = observable.box('');

  @action setStories(stories) {
    this.stories = stories;
  }

  @action addStory(story) {
    this.stories.push(story);
  }

  @action updateStory(id, newStory) {
    // Hack needed to prevent the immediate update of a component due to mobx
    // observables. When changing the collection of a story, that would
    // remove it from the current active table and throw an error when the app
    // would try to run this.setState on an unmounted component.
    setTimeout(() => runInAction(() => {
      this.stories = this.stories
        .map(s => {
          if (s._id !== id) return s;
          if (s.fromCollection !== newStory.fromCollection) return null;
          return newStory;
        })
        .filter(s => s);
    }), 100);
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

  @action setSelectedCollection(value) {
    this.selectedCollection.set(value);
  }

  @action reset() {
    this.collections = [];
    this.stories = [];
    this.selectedCollection = observable.box('');
  }

  @computed get getSelectedCollection() {
    return this.selectedCollection.get();
  }
}

export const storyStorePropTypes = PropTypes.shape({
  stories: PropTypes.arrayOf(PropTypes.shape(StoryModel)),
  collections: PropTypes.arrayOf(PropTypes.shape(CollectionModel)),

  setStories: PropTypes.func,
  addStory: PropTypes.func,
  updateStory: PropTypes.func,
  removeStory: PropTypes.func,

  setCollections: PropTypes.func,
  addCollection: PropTypes.func,
  updateCollection: PropTypes.func,
  removeCollection: PropTypes.func,

  setSelectedCollection: PropTypes.func,
  getSelectedCollection: PropTypes.func,
});


export const storyStore = new StoryStore();
