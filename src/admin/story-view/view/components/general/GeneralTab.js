import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import notFoundImg from '../../../../../assets/notfound.png';
import { parseContent } from '../../../../../shared/utilities';

import styles from './GeneralTab.module.scss';

class GeneralTab extends Component {
  render() {
    const { story } = this.props;
    return (
      <>
        <Typography
          variant="h6"
          color="inherit"
        >
          {parseContent(story.shortDescription)}
        </Typography>
        <div className={styles.longDescriptionContainer}>
          <img
            alt={story.name}
            className={styles.coverPic}
            src={story.coverPic || notFoundImg}
          />
          {parseContent(story.longDescription)}
        </div>
      </>
    );
  }
}

GeneralTab.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
};

export default GeneralTab;
