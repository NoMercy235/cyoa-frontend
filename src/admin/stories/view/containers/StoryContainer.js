import React, { Component, Fragment } from 'react';
import CollectionsTableCmp from '../components/CollectionsTableCmp';
import StoriesTableCmp from '../components/StoriesTableCmp';
import classes from '../../style/StoryContainer.module.scss';

class StoryContainer extends Component {
  render() {
    return (
      <Fragment>
        <div className={classes.tableContainer}>
          <CollectionsTableCmp />
          <StoriesTableCmp />
        </div>
      </Fragment>
    );
  }
}

StoryContainer.propTypes = {
};

export default StoryContainer;
