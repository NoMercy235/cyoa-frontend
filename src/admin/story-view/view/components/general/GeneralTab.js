import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import notFoundImg from '../../../../../assets/notfound.png';
import { parseContent } from '../../../../../shared/utilities';
import {
  MAX_STORY_SCENE_PIC_SIZE_MB,
  STORY_PICTURE_CROPPER_SIZE,
  STORY_PICTURE_PREVIEW_SIZE,
} from '../../../../../shared/constants/stories';
import FilePicker from '../../../../../shared/components/form/FileSelect/FilePicker';

import styles from './GeneralTab.module.scss';

const compressOptions = {
  maxSizeMB: MAX_STORY_SCENE_PIC_SIZE_MB,
  maxWidthOrHeight: STORY_PICTURE_CROPPER_SIZE.height,
};

class GeneralTab extends Component {
  render() {
    const { story, onCoverPicChanged } = this.props;
    return (
      <>
        <Typography
          variant="h6"
          color="inherit"
        >
          {parseContent(story.shortDescription)}
        </Typography>
        <div className={styles.longDescriptionContainer}>
          <div className={styles.coverPic}>
            <FilePicker
              inputId="story-cover"
              disabled={story.published}
              initialImage={story.coverPic || notFoundImg}
              cropperProps={{
                size: STORY_PICTURE_PREVIEW_SIZE,
                cropperProps: {
                  size: STORY_PICTURE_CROPPER_SIZE,
                },
              }}
              compressOptions={compressOptions}
              onFileSave={onCoverPicChanged}
            />
          </div>
          {parseContent(story.longDescription)}
        </div>
      </>
    );
  }
}

GeneralTab.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
  onCoverPicChanged: PropTypes.func.isRequired,
};

export default GeneralTab;
