import React, { Component, Fragment } from 'react';
import LandingCmp from '../components/landing/LandingCmp';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { inject, observer } from 'mobx-react';
import { publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import classes from './LandingContainer.module.scss';
import StoryFilters from '../components/story-filters/StoryFilters';

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
        <div className={classes.container}>
          <StoryFilters/>
          <LandingCmp
            stories={publicStoryStore.stories}
          />
        </div>
      </Fragment>
    );
  }
}

LandingContainer.propTypes = {
  publicStoryStore: publicStoryStorePropTypes,
};

export default LandingContainer;
