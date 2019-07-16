import React, { Component } from 'react';
import { inject } from 'mobx-react';

import FiltersCmp from '../components/story-filters/FiltersCmp';
import { BaseService } from '../../../../infrastructure/services/BaseService';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { FiltersType, publicStoryStorePropTypes } from '../../stores/PublicStoryStore';
import AdvancedFiltersCmp from '../components/story-filters/AdvancedFilters';
import { debounced } from '../../../../shared/utilities';
import { appStorePropTypes } from '../../../../shared/store/AppStore';

const advancedFilterInitialValues = {
  tags: [],
  titleOrDescription: '',
  authorShort: '',
};

const debouncedQuickList = debounced(publicStoryService.quickList);

@inject('publicStoryStore', 'appStore')
class FiltersContainer extends Component {
  state = {
    quickSearchValue: '',
    isAdvancedFiltersDrawerOpened: false,
    currentAdvancedFilters: advancedFilterInitialValues,
  };

  onBeforeSearch = type => {
    const { appStore, publicStoryStore } = this.props;
    // We reset the stories to avoid problems with infinite scroll trigger
    // when the new stories come in.
    publicStoryStore.setStories([]);
    appStore.queryParams.publicStories.reset();
    publicStoryStore.filterType = type;
    publicStoryStore.reachedEnd = true;
  };

  onAfterSearch = stories => {
    const { appStore, publicStoryStore } = this.props;

    // This is the same condition as the one in LandingContainer
    publicStoryStore.reachedEnd = stories.length < appStore.queryParams.publicStories.pagination.limit;
    publicStoryStore.setStories(stories);
  };

  onQuickSearch = async ({ target: { value } }) => {
    const { appStore } = this.props;

    this.onBeforeSearch(FiltersType.Quick);

    this.setState({
      quickSearchValue: value,
      currentAdvancedFilters: advancedFilterInitialValues,
    });

    appStore.queryParams.publicStories.addCustomQueryParam({
      name: 'quickSearch', value
    });

    const { stories } = await debouncedQuickList(
      value,
      appStore.queryParams.publicStories
    );

    this.onAfterSearch(stories);
  };

  onAdvancedSearch = async values => {
    const { appStore } = this.props;

    this.onBeforeSearch(FiltersType.Advanced);

    this.setState({
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
    Object.keys(parsedValues).forEach(key => {
      if (Array.isArray(parsedValues[key])) {
        appStore.queryParams.publicStories.addFilter(
          { name: key, op: 'in', value: parsedValues[key] },
        );
      } else {
        appStore.queryParams.publicStories.addFilter(
          { name: key, op: 'ilike', value: parsedValues[key] },
        );
      }
    });
    appStore.queryParams.publicStories.filters = BaseService.withOrFilters(
      appStore.queryParams.publicStories.filters
    );

    const { stories } = await publicStoryService.list(
      appStore.queryParams.publicStories
    );

    this.onAfterSearch(stories);
  };

  onSwitchAdvancedFilters = state => () => {
    this.setState({
      isAdvancedFiltersDrawerOpened: state,
    });
  };

  render() {
    const {
      publicStoryStore: {
        filterType,
      },
    } = this.props;
    const {
      quickSearchValue,
      isAdvancedFiltersDrawerOpened,
      currentAdvancedFilters,
    } = this.state;

    return (
      <>
        <FiltersCmp
          filterType={filterType}
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
  appStore: appStorePropTypes,
  publicStoryStore: publicStoryStorePropTypes,
};

export default FiltersContainer;
