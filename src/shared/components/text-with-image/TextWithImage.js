import React from 'react';
import * as PropTypes from 'prop-types';
import ImagePreview from '../form/FileSelect/ImagePreview';

import styles from './TextWithImage.module.scss';

const TextWithImage = ({ image, size, text }) => {
  return (
    <div className={styles.container}>
      {image && (
        <ImagePreview
          image={image}
          size={size}
        />
      )}
      {text}
    </div>
  );
};

TextWithImage.propTypes = {
  image: PropTypes.string,
  size: PropTypes.object,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default TextWithImage;
