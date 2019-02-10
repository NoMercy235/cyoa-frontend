import { observable, action } from 'mobx';
import * as PropTypes from 'prop-types';
import { AttributeModel } from '../../../infrastructure/models/AttributeModel';

class StoryViewStore {
  @observable attributes = [];
  @observable sequences = [];

  @action setAttributes(attributes) {
    this.attributes = attributes;
  }

  @action addAttribute(attribute) {
    this.attributes.push(attribute);
  }

  @action updateAttribute(id, newAttribute) {
    this.attributes = this.attributes
      .map(a => {
        if (a._id !== id) return a;
        return newAttribute;
      });
  }

  @action removeAttribute(attributeId) {
    this.attributes = this.attributes.filter(a => a._id !== attributeId);
  }

  @action setSequences(sequences) {
    this.sequences = sequences;
  }

  @action addSequence(sequence) {
    this.sequences.push(sequence);
  }

  @action updateSequence(id, newSequence) {
    this.sequences = this.sequences
      .map(s => {
        if (s._id !== id) return s;
        return newSequence;
      });
  }

  @action removeSequence(sequenceId) {
    this.sequences = this.sequences.filter(a => a._id !== sequenceId);
  }

  @action setOptionsToSequence(sequenceId, options) {
    const s = this.getSequenceById(sequenceId);
    s.options = options;
  }

  @action addOptionToSequence(sequenceId, option) {
    const s = this.sequences.find(s => s._id === sequenceId);
    s.options.push(option);
  }

  @action updateOption(sequenceId, optionId, option) {
    const seq = this.sequences.find(s => s._id === sequenceId);
    seq.options = seq.options.map(o => {
      if (o._id !== optionId) return o;
      return option;
    });
  }

  @action reset() {
    this.attributes = [];
    this.sequences = [];
  }

  getSequenceOptions(sequenceId) {
    return this.getSequenceById(sequenceId).options;
  }

  getSequenceById(sequenceId) {
    return this.sequences.find(s => s._id === sequenceId);
  }

  getAttributeById(attributeId) {
    return this.attributes.find(a => a._id === attributeId);
  }
}

export const storyViewStorePropTypes = PropTypes.shape({
  attributes: PropTypes.arrayOf(PropTypes.shape(AttributeModel)),

  setAttributes: PropTypes.func,
  addAttribute: PropTypes.func,
  updateAttribute: PropTypes.func,
  removeAttribute: PropTypes.func,

  getSequenceById: PropTypes.func,
  getAttributeById: PropTypes.func,

  setOptionsToSequence: PropTypes.func,
  addOptionToSequence: PropTypes.func,

  reset: PropTypes.func,
});


export const storyViewStore = new StoryViewStore();
