import React, { Component } from 'react';
import FiltersCmp from '../components/story-filters/FiltersCmp';
import { BaseService } from '../../../../infrastructure/services/BaseService';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { inject } from 'mobx-react';
import { publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import AdvancedFiltersCmp from '../components/story-filters/AdvancedFilters';

const advancedFilterInitialValues = {
  tags: [],
  titleOrDescription: '',
  authorShort: '',
};

@inject('publicStoryStore')
class FiltersContainer extends Component {
  state = {
    hasAdvancedFilters: false,
    quickSearchValue: '',
    isAdvancedFiltersDrawerOpened: false,
    currentAdvancedFilters: advancedFilterInitialValues,
  };

  setStories = stories => {
    this.props.publicStoryStore.setStories(stories);
  };

  getStories = async filters => {
    this.setStories(
      await publicStoryService.list(filters),
    );
  };

  onQuickSearch = async ({ target: { value } }) => {
    this.setState({
      hasAdvancedFilters: false,
      quickSearchValue: value,
      currentAdvancedFilters: advancedFilterInitialValues,
    });
    this.setStories(
      await publicStoryService.quickList(value),
    );
  };

  onAdvancedSearch = async values => {
    this.setState({
      hasAdvancedFilters: true,
      currentAdvancedFilters: { ...values },
      isAdvancedFiltersDrawerOpened: false,
      quickSearchValue: '',
    });

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

  onSwitchAdvancedFilters = state => () => {
    this.setState({
      isAdvancedFiltersDrawerOpened: state,
    });
  };

  render() {
    const {
      hasAdvancedFilters,
      quickSearchValue,
      isAdvancedFiltersDrawerOpened,
      currentAdvancedFilters,
    } = this.state;

    return (
      <>
        <FiltersCmp
          hasAdvancedFilters={hasAdvancedFilters}
          quickSearchValue={quickSearchValue}
          onQuickSearch={this.onQuickSearch}
          onOpenAdvancedFilters={this.onSwitchAdvancedFilters(true)}
        />
        <AdvancedFiltersCmp
          open={isAdvancedFiltersDrawerOpened}
          currentAdvancedFilters={currentAdvancedFilters}
          onAdvancedSearch={this.onAdvancedSearch}
          onHandleDrawerClose={this.onSwitchAdvancedFilters(false)}
        />
      </>
    );
  }
}

FiltersContainer.propTypes = {
  publicStoryStore: publicStoryStorePropTypes,
};

export default FiltersContainer;
