import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import PublishBtn from './PublishBtn';
import classes from './GeneralTab.module.scss';

class GeneralTab extends Component {
  render() {
    const { story } = this.props;
    return (
      <div className={classes.container}>
        <PublishBtn story={story}/>
      </div>
    );
  }
}

GeneralTab.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
};

export default GeneralTab;
