import React, { Component } from 'react';
import FiltersCmp from '../components/landing/FiltersCmp';
import { BaseService } from '../../../../infrastructure/services/BaseService';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { inject } from 'mobx-react';
import { publicStoryStorePropTypes } from '../../stores/PublicStoryStore';

@inject('publicStoryStore')
class FiltersContainer extends Component {
  setStories = stories => {
    this.props.publicStoryStore.setStories(stories);
  };

  getStories = async filters => {
    this.setStories(
      await publicStoryService.list(filters),
    );
  };

  onQuickSearch = async ({ target: { value } }) => {
    this.setStories(
      await publicStoryService.quickList(value),
    );
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

  render() {
    return (
      <FiltersCmp
        onChange={this.onQuickSearch}
      />
    );
  }
}

FiltersContainer.propTypes = {
  publicStoryStore: publicStoryStorePropTypes,
};

export default FiltersContainer;
