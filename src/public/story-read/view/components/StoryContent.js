import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import DisplaySequence from './sequence/DisplaySequence';

class StoryContent extends Component {
  state = { seqId: this.props.story.startSeq._id };

  onOptionClick = async option => {
    this.setState({ seqId: option.nextSeq });
  };

  render() {
    const { story } = this.props;

    return (
      <Fragment>
        <DisplaySequence
          story={story}
          seq={this.state.seqId}
          onOptionClick={this.onOptionClick}
        />
      </Fragment>
    );
  }
}

StoryContent.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
};

export default StoryContent;
