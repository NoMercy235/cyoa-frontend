import React from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import * as styles from './ImagePreview.module.scss';

const ImagePreview = ({ image, size, onCancel, onSave }) => {
  return (
    <>
      <img alt="Preview" src={image} style={{ ...size }}/>
      <div className={styles.buttonsContainer}>
        <Button
          variant="contained"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </>
  );
};

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ImagePreview;
