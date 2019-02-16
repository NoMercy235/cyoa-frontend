import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import DisplaySequence from './sequence/DisplaySequence';
import { withRouter } from 'react-router-dom';
import { makePath, READ_STORY_ROUTE } from '../../../../shared/constants/routes';

class StoryContent extends Component {
  state = { seq: this.props.story.startSeq };

  onOptionClick = async option => {
    this.props.history.push(
      makePath(
        READ_STORY_ROUTE,
        {
          ':storyId': this.props.story._id,
          ':seqId': option.nextSeq,
        }
      )
    );
  };

  render() {
    const { story, match, history } = this.props;

    return (
      <Fragment>
        <DisplaySequence
          story={story}
          seq={match.params.seqId}
          history={history}
          onOptionClick={this.onOptionClick}
        />
      </Fragment>
    );
  }
}

StoryContent.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(StoryContent);
