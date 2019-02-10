import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';

class ReadStoryCmp extends Component {
  render() {
    return (
      <span>read me from cmp {this.props.story.name} </span>
    );
  }
}

ReadStoryCmp.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
};

export default ReadStoryCmp;
