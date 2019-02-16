import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import styles from './GeneralTab.module.scss';
import Typography from '@material-ui/core/Typography';

class GeneralTab extends Component {
  render() {
    const { story } = this.props;
    return (
      <Fragment>
        <Typography
          variant="h6"
          color="inherit"
        >
          {story.shortDescription}
        </Typography>
        <div className={styles.longDescriptionContainer}>
          <img
            alt="Cover"
            className={styles.coverPic}
            src={story.coverPic}
          />
          <Typography
            variant="h6"
            color="inherit"
          >
            {story.longDescription}
          </Typography>
        </div>
      </Fragment>
    );
  }
}

GeneralTab.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
};

export default GeneralTab;