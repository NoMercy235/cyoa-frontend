import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import { StoryModel } from '../../../../infrastructure/models/StoryModel';

class WriteStoryContainer extends Component {
  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render() {
    return (
      <div>
        WRITE STORY V2
      </div>
    );
  }
}

WriteStoryContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
};

export default WriteStoryContainer;
