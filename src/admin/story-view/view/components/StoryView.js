import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../stories/domain/models/StoryModel';

class StoryView extends Component {
  render() {
    return (
      <Fragment>
        Story cmp
        <br />
        {this.props.story.name}
      </Fragment>
    );
  }
}

StoryView.propTypes = {
  story: PropTypes.shape(StoryModel),
};

export default StoryView;
