import React, { Component, Fragment } from 'react';
import LandingCmp from '../components/landing/LandingCmp';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { inject, observer } from 'mobx-react';
import { publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import classes from './LandingContainer.module.scss';
import StoryFilters from '../components/story-filters/StoryFilters';
import { BaseService } from '../../../../infrastructure/services/BaseService';

@inject('publicStoryStore')
@observer
class LandingContainer extends Component {
  getStories = async filters => {
    const stories = await publicStoryService.list(filters);
    this.props.publicStoryStore.setStories(stories);
  };

  onSearch = async values => {
    const parsedValues = {
      name: values.titleOrDescription,
      description: values.titleOrDescription,
      authorShort: values.authorShort,
      tags: values.tags,
    };
    let filters = {};

    Object.keys(parsedValues).forEach(key => {
      if (Array.isArray(parsedValues[key])) {
        filters[key] = { op: 'in', value: parsedValues[key] };
      } else {
        filters[key] = { op: 'ilike', value: parsedValues[key] };
      }
    });
    await this.getStories(BaseService.withOrFilters(filters));
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
          <StoryFilters
            onSearch={this.onSearch}
          />
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
