import React, { Component, Fragment } from 'react';
import CollectionsTableCmp from '../components/tables/CollectionsTableCmp';
import StoriesTableCmp from '../components/tables/StoriesTableCmp';
import classes from '../../style/StoryContainer.module.scss';
import { storyService } from '../../domain/services/StoryService';
import { inject, observer } from 'mobx-react';
import { storyStorePropTypes } from '../../domain/stores/StoryStore';
import { StoryModel } from '../../domain/models/StoryModel';
import NewStory from '../components/actions/NewStory';
import ActionBar from '../../../../shared/components/ActionBar';

@inject('storyStore')
@observer
class StoryContainer extends Component {
  async fetchStories() {
    const stories = (await storyService.list()).map(s => new StoryModel(s));
    this.props.storyStore.setStories(stories);
  }

  componentDidMount () {
    this.fetchStories();
  }

  render() {
    return (
      <Fragment>
        <div className={classes.tableContainer}>
          <div className={classes.collectionsContainer}>
            <CollectionsTableCmp />
          </div>
          <div className={classes.storiesContainer}>
            <ActionBar>
              <NewStory />
            </ActionBar>
            <StoriesTableCmp stories={this.props.storyStore.stories} />
          </div>
        </div>
      </Fragment>
    );
  }
}

StoryContainer.propTypes = {
  storyStore: storyStorePropTypes,
};

export default StoryContainer;
