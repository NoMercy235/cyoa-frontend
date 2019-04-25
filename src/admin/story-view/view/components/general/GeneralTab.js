import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import styles from './GeneralTab.module.scss';
import Typography from '@material-ui/core/Typography';
import notFoundImg from '../../../../../assets/notfound.png';
import { parseContent } from '../../../../../shared/utilities';

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
            src={story.coverPic || notFoundImg}
          />
          {parseContent(story.longDescription)}
        </div>
      </Fragment>
    );
  }
}

GeneralTab.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
};

export default GeneralTab;
