import { observable, action, computed, runInAction } from 'mobx';
import * as PropTypes from 'prop-types';

import { AttributeModel } from '../../../infrastructure/models/AttributeModel';
import { SequenceModel } from '../../../infrastructure/models/SequenceModel';
import { StoryModel } from '../../../infrastructure/models/StoryModel';

class StoryViewStore {
  @observable attributes = [];
  @observable sequences = [];
  @observable chapters = [];
  @observable currentStory = null;

  @action setAttributes = attributes => {
    this.attributes = attributes;
  };

  @action addAttribute = attribute => {
    this.attributes.push(attribute);
  };

  @action updateAttribute = (id, newAttribute) => {
    this.attributes = this.attributes
      .map(a => {
        if (a.id !== id) return a;
        return newAttribute;
      });
  };

  @action removeAttribute = attributeId => {
    this.attributes = this.attributes.filter(a => a.id !== attributeId);
  };

  @action setSequences = sequences => {
    this.sequences = sequences;
  };

  @action addSequence = sequence => {
    this.sequences.push(sequence);
  };

  @action updateSequence = (id, newSequence) => {
    // Similar to what we did for stories (when they were changing collections,
    // we need to wait a little bit here as well when changing the chapter of a
    // sequence in order to prevent the warning thrown by react when its trying to
    // call setState on an unmounted component
    setTimeout(() => runInAction(() => {
      this.sequences = this.sequences
        .map(s => {
          if (s.id !== id) return s;
          if (s.chapter !== newSequence.chapter) return null;
          return newSequence;
        })
        .filter(s => s);
    }), 100);
  };

  @action updateSequenceInPlace = (id, metadata) => {
    this.sequences = this.sequences
      .map(s => {
        if (s.id !== id) return s;
        s = Object.assign(s, metadata);
        return s;
      });
  };

  @action removeSequence = sequenceId => {
    this.sequences = this.sequences.filter(a => a.id !== sequenceId);
  };

  @action setOptionsToSequence = (sequenceId, options) => {
    const s = this.getSequenceById(sequenceId);
    s.options = options;
  };

  @action addOptionToSequence = (sequenceId, option) => {
    const s = this.sequences.find(s => s.id === sequenceId);
    s.options.push(option);
  };

  @action updateOption = (sequenceId, optionId, option) => {
    const seq = this.sequences.find(s => s.id === sequenceId);
    seq.options = seq.options.map(o => {
      if (o.id !== optionId) return o;
      return option;
    });
  };

  @action removeOptionFromSequence = (sequenceId, optionId) => {
    const seq = this.getSequenceById(sequenceId);
    seq.options = seq.options.filter(o => o.id !== optionId);
  };

  @action setCurrentStory = story => {
    this.currentStory = story;
  };

  @action updateCurrentStory = metadata => {
    this.currentStory = new StoryModel(
      Object.assign({}, this.currentStory, metadata)
    );
  };

  @action setChapters = chapters => {
    this.chapters = chapters;
  };

  @action addChapter = chapter => {
    this.chapters.push(chapter);
  };

  @action updateChapter = (id, newChapter) => {
    this.chapters = this.chapters
      .map(c => {
        if (c.id !== id) return c;
        return newChapter;
      });
  };

  @action reset = () => {
    this.attributes = [];
    this.sequences = [];
    this.currentStory = null;
  };

  @computed get sequencesInOrder() {
    return this.sequences.slice().sort((a, b) => {
      return a.order > b.order ? 1 : -1;
    });
  }

  getSequenceOptions(sequenceId) {
    return this.getSequenceById(sequenceId).options;
  }

  getSequenceById(sequenceId) {
    return this.sequences.find(s => s.id === sequenceId);
  }

  getAttributeById(attributeId) {
    return this.attributes.find(a => a.id === attributeId);
  }
}

export const storyViewStorePropTypes = PropTypes.shape({
  attributes: PropTypes.arrayOf(PropTypes.shape(AttributeModel)),
  sequences: PropTypes.arrayOf(PropTypes.shape(SequenceModel)),
  currentStory: PropTypes.instanceOf(StoryModel),

  setAttributes: PropTypes.func,
  addAttribute: PropTypes.func,
  updateAttribute: PropTypes.func,
  removeAttribute: PropTypes.func,

  setSequences: PropTypes.func,
  addSequence: PropTypes.func,
  getSequenceById: PropTypes.func,
  getAttributeById: PropTypes.func,
  updateSequence: PropTypes.func,
  updateSequenceInPlace: PropTypes.func,

  setOptionsToSequence: PropTypes.func,
  addOptionToSequence: PropTypes.func,
  updateOption: PropTypes.func,
  removeOptionFromSequence: PropTypes.func,

  setCurrentStory: PropTypes.func,
  updateCurrentStory: PropTypes.func,

  setChapters: PropTypes.func,
  addChapter: PropTypes.func,

  reset: PropTypes.func,
});


export const storyViewStore = new StoryViewStore();
