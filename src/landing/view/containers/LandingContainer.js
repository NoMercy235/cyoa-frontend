import React, { Component } from 'react';
import LandingCmp from '../components/LandingCmp';
import { publicStoryService } from '../../../infrastructure/services/StoryService';
import { inject, observer } from 'mobx-react';
import { publicStoryStorePropTypes } from '../../stores/PublicStoryStore';

@inject('publicStoryStore')
@observer
class LandingContainer extends Component {
  getStories = async () => {
    const stories = await publicStoryService.list();
    this.props.publicStoryStore.setStories(stories);
  };

  componentDidMount () {
    this.getStories();
  }

  render() {
    const { publicStoryStore } = this.props;
    return (
      <LandingCmp
        stories={publicStoryStore.stories}
      />
    );
  }
}

LandingContainer.propTypes = {
  publicStoryStore: publicStoryStorePropTypes,
};

export default LandingContainer;
