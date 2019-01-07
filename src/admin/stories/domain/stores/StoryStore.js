import { observable, action } from 'mobx';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../models/StoryModel';

class StoryStore {
  @observable stories = [];

  @action setStories(stories) {
    this.stories = stories;
  }
}

export const storyStorePropTypes = PropTypes.shape({
  stories: PropTypes.arrayOf(PropTypes.shape(StoryModel)),

  setStories: PropTypes.func,
});


export const storyStore = new StoryStore();
