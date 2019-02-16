import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import StoryContent from './StoryContent';

class ReadStoryCmp extends Component {
  render() {
    const { story } = this.props;
    return (
      <Fragment>
        <StoryContent story={story}/>
      </Fragment>
    );
  }
}

ReadStoryCmp.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
};

export default ReadStoryCmp;
