import React, { Component, Fragment } from 'react';
import CollectionsTableCmp from '../components/CollectionsTableCmp';
import StoriesTableCmp from '../components/StoriesTableCmp';
import classes from '../../style/StoryContainer.module.scss';
import { storyService } from '../../domain/services/StoryService';
import { inject, observer } from 'mobx-react';
import { storyStorePropTypes } from '../../domain/stores/StoryStore';

@inject('storyStore')
@observer
class StoryContainer extends Component {
  componentDidMount () {
    storyService.list().then(stories => {
      this.props.storyStore.setStories(stories);
    });
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
