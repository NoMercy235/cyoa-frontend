import { observable, action } from 'mobx';
import * as PropTypes from 'prop-types';

import { StoryModel } from '../../../infrastructure/models/StoryModel';
import { CollectionModel } from '../../../infrastructure/models/CollectionModel';

class PublicStoryStore {
  @observable stories = [];
  @observable collections = [];

  @action setStories = stories => {
    this.stories = stories;
  };

  @action setCollections = collections => {
    this.collections = collections;
  };
}

export const publicStoryStorePropTypes = PropTypes.shape({
  stories: PropTypes.arrayOf(PropTypes.instanceOf(StoryModel)),
  collections: PropTypes.arrayOf(PropTypes.instanceOf(CollectionModel)),

  setStories: PropTypes.func,
  setCollections: PropTypes.func,
});


export const publicStoryStore = new PublicStoryStore();
