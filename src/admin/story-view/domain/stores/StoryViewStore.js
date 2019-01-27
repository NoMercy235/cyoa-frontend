import { observable, action } from 'mobx';
import * as PropTypes from 'prop-types';
import { AttributeModel } from '../models/AttributeModel';

class StoryViewStore {
  @observable attributes = [];

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
}

export const storyViewStorePropTypes = PropTypes.shape({
  attributes: PropTypes.arrayOf(PropTypes.shape(AttributeModel)),

  setAttributes: PropTypes.func,
  addAttribute: PropTypes.func,
  updateAttribute: PropTypes.func,
  removeAttribute: PropTypes.func,
});


export const storyViewStore = new StoryViewStore();
