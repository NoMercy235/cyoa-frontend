import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../stories/domain/models/StoryModel';

class SequenceTabContainer extends Component {
  render() {
    return (
      <Fragment>
        <span>Sequence tab</span>
      </Fragment>
    );
  }
}

SequenceTabContainer.propTypes = {
  story: PropTypes.shape(StoryModel),
};

export default SequenceTabContainer;
