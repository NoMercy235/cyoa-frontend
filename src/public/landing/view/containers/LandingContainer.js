import React, { Component, Fragment } from 'react';
import LandingCmp from '../components/landing/LandingCmp';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { inject, observer } from 'mobx-react';
import { publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';

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
      <Fragment>
        <Breadcrumb/>
        <LandingCmp
          stories={publicStoryStore.stories}
        />
      </Fragment>
    );
  }
}

LandingContainer.propTypes = {
  publicStoryStore: publicStoryStorePropTypes,
};

export default LandingContainer;
