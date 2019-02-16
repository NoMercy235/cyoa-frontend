import React, { Component, Fragment } from 'react';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { withRouter } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import ReadStoryCmp from '../components/ReadStoryCmp';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';

class ReadStoryContainer extends Component {
  state = { story: null };

  getStory = async (storyId) => {
    const options = { ignoreFields: 'coverPic' };
    const story = await publicStoryService.get(storyId, options);
    this.setState({ story });
  };

  componentDidMount () {
    this.getStory(this.props.match.params.id);
  }

  render() {
    return (
      <Fragment>
        <Breadcrumb/>
        {this.state.story && <ReadStoryCmp
          story={this.state.story}
        />}
      </Fragment>
    );
  }
}

ReadStoryContainer.propTypes = {
  match: PropTypes.object,
};

export default withRouter(ReadStoryContainer);
