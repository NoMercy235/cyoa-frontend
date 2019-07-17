import { observable, action } from 'mobx';
import * as PropTypes from 'prop-types';

import { StoryModel } from '../../../infrastructure/models/StoryModel';
import { CollectionModel } from '../../../infrastructure/models/CollectionModel';

export const FiltersType = {
  None: 'NONE',
  Quick: 'QUICK',
  Advanced: 'ADVANCED',
};

class PublicStoryStore {
  @observable stories = [];
  @observable collections = [];
  @observable filterType = FiltersType.None;
  @observable reachedEnd = false;

  @action setStories = stories => {
    this.stories = stories;
  };

  @action addStories = stories => {
    this.stories.push(...stories);
  };

  @action setCollections = collections => {
    this.collections = collections;
  };

  @action reset = () => {
    this.stories = [];
    this.collections = [];
    this.filterType = FiltersType.None;
    this.reachedEnd = false;
  };
}

export const publicStoryStorePropTypes = PropTypes.shape({
  stories: PropTypes.arrayOf(PropTypes.instanceOf(StoryModel)),
  collections: PropTypes.arrayOf(PropTypes.instanceOf(CollectionModel)),
  filterType: PropTypes.bool,
  reachedEnd: PropTypes.bool,

  setStories: PropTypes.func,
  addStories: PropTypes.func,
  setCollections: PropTypes.func,
  reset: PropTypes.func,
});


export const publicStoryStore = new PublicStoryStore();
