import React, { Component, Fragment } from 'react';
import CollectionsTableCmp from '../components/CollectionsTableCmp';
import StoriesTableCmp from '../components/StoriesTableCmp';
import classes from '../../style/StoryContainer.module.scss';
import { storyService } from '../../domain/services/StoryService';
import { inject, observer } from 'mobx-react';
import { storyStorePropTypes } from '../../domain/stores/StoryStore';
import { StoryModel } from '../../domain/models/StoryModel';

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
          <CollectionsTableCmp />
          <StoriesTableCmp stories={this.props.storyStore.stories} />
        </div>
      </Fragment>
    );
  }
}

StoryContainer.propTypes = {
  storyStore: storyStorePropTypes,
};

export default StoryContainer;
