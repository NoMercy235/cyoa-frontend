import React, { Component } from 'react';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { withRouter } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import StoryContent from '../components/StoryContent';
import { publicChapterService } from '../../../../infrastructure/services/ChapterService';
import { NOT_FOUND_ROUTE } from '../../../../shared/constants/routes';

class ReadStoryContainer extends Component {
  state = { canRender: false, story: null, chapters: [] };

  getStory = async (storyId) => {
    try {
      const options = { ignoreFields: 'coverPic' };
      const story = await publicStoryService.get(storyId, options);
      await this.getChapters(story);
      this.setState({ story });
    } catch (e) {
      const { history } = this.props;
      history.replace(NOT_FOUND_ROUTE);
    }
  };

  getChapters = async () => {
    const params = { ':story': this.props.match.params.storyId };
    publicChapterService.setNextRouteParams(params);
    const chapters = await publicChapterService.list({});
    this.setState({ chapters, canRender: true });
  };

  componentDidMount () {
    this.getStory(this.props.match.params.storyId);
  }

  render() {
    const { canRender, story, chapters } = this.state;

    return (
      <>
        <Breadcrumb/>
        {canRender && (
          <StoryContent
            story={story}
            chapters={chapters}
          />
        )}
      </>
    );
  }
}

ReadStoryContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(ReadStoryContainer);
