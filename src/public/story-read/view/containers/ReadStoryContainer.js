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

  goTo404 = () => {
    const { history } = this.props;
    history.replace(NOT_FOUND_ROUTE);
  };

  getStory = async storyId => {
    const options = { ignoreFields: 'coverPic' };
    const story = await publicStoryService.get(storyId, options);
    this.setState({ story });
  };

  getChapters = async storyId => {
    const params = { ':story': storyId };
    publicChapterService.setNextRouteParams(params);
    const chapters = await publicChapterService.list({});
    this.setState({ chapters });
  };

  async componentDidMount () {
    const storyId = this.props.match.params.storyId;

    try {
      await Promise.all([
        this.getStory(storyId),
        this.getChapters(storyId),
      ]);
    } catch (e) {
      this.goTo404();
    }
    this.setState({ canRender: true });
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
