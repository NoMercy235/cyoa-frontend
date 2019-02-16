import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import DisplaySequence from './DisplaySequence';

class StoryContent extends Component {
  render() {
    const { story } = this.props;
    const { startSeq: seq } = story;

    return (
      <Fragment>
        <DisplaySequence seq={seq}/>
      </Fragment>
    );
  }
}

StoryContent.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
};

export default StoryContent;
