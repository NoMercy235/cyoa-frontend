import React, { Component, Fragment } from 'react';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { withRouter } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import StoryContent from '../components/StoryContent';
import { chapterService } from '../../../../infrastructure/services/ChapterService';

class ReadStoryContainer extends Component {
  state = { canRender: false, story: null, chapters: [] };

  getStory = async (storyId) => {
    const options = { ignoreFields: 'coverPic' };
    const story = await publicStoryService.get(storyId, options);
    this.setState({ story });
    this.getChapters(story);
  };

  getChapters = async () => {
    const params = { ':story': this.props.match.params.storyId };
    chapterService.setNextRouteParams(params);
    const chapters = await chapterService.list({});
    this.setState({ chapters, canRender: true });
  };

  componentDidMount () {
    this.getStory(this.props.match.params.storyId);
  }

  render() {
    const { canRender, story, chapters } = this.state;

    return (
      <Fragment>
        <Breadcrumb/>
        {canRender && (
          <StoryContent
            story={story}
            chapters={chapters}
          />
        )}
      </Fragment>
    );
  }
}

ReadStoryContainer.propTypes = {
  match: PropTypes.object,
};

export default withRouter(ReadStoryContainer);
