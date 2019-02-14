import React, { Component, Fragment } from 'react';
import { storyService } from '../../../../infrastructure/services/StoryService';
import StoryView from '../components/StoryView';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';

@inject('storyViewStore')
@observer
class StoryViewContainer extends Component {
  async fetchStory(storyId) {
    const story = (await storyService.get(storyId));
    this.props.storyViewStore.setCurrentStory(story);
  }

  componentDidMount () {
    this.fetchStory(this.props.match.params.id);
  }

  componentWillUnmount () {
    this.props.storyViewStore.reset();
  }

  render() {
    const { currentStory } = this.props.storyViewStore;

    if (!currentStory) {
      return <span>Loading...</span>;
    }

    return (
      <Fragment>
        <StoryView story={currentStory} />
      </Fragment>
    );
  }
}

StoryViewContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withRouter(StoryViewContainer);
