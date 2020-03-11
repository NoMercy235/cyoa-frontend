import React from 'react';
import * as PropTypes from 'prop-types';

import styles from './FileSelectV2.module.scss';

class FileSelectV2 extends React.Component {
  static defaultProps = {
    accept: 'image/*',
    stylesProp: {},
  };

  onFileUploaded = async ev => {
    const { onFileUploaded } = this.props;

    const file = ev.target.files[0];

    if (!file) return;
    onFileUploaded(file);
  };

  render() {
    const { id, accept, initialImage, stylesProp } = this.props;

    return (
      <div
        className={styles.container}
        style={stylesProp}
      >
        <input
          id={id}
          className={styles.uploadInput}
          type="file"
          accept={accept}
          onChange={this.onFileUploaded}
        />
        <label htmlFor={id}>
          <div
            className={styles.uploadInputOverlay}
            style={stylesProp}
          >
            Choose photo
          </div>
          <img
            alt=""
            src={initialImage}
            className={styles.initialImage}
            style={stylesProp}
          />
        </label>
      </div>
    );
  }
}

FileSelectV2.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  stylesProp: PropTypes.object,
  initialImage: PropTypes.string,
  accept: PropTypes.string,
  onFileUploaded: PropTypes.func.isRequired,
};

export default FileSelectV2;
