import React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

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

  renderDisabled = () => {
    const {
      className,
      initialImage,
      stylesProp,
    } = this.props;

    return (
      <div
        className={classNames(styles.container, className)}
        style={stylesProp}
      >
        <img
          alt=""
          src={initialImage}
          className={styles.initialImage}
          style={stylesProp}
        />
      </div>
    );
  };

  render() {
    const {
      className,
      id,
      accept,
      initialImage,
      stylesProp,
      disabled
    } = this.props;

    if (disabled) {
      return this.renderDisabled();
    }

    return (
      <div
        className={classNames(styles.container, className)}
        style={stylesProp}
      >
        <input
          id={id}
          className={styles.uploadInput}
          type="file"
          accept={accept}
          onChange={this.onFileUploaded}
        />
        <label
          htmlFor={id}
          className={styles.uploadLabel}
        >
          <div
            className={styles.uploadInputOverlay}
            style={stylesProp}
          >
            Choose photo
          </div>
          <img
            alt=""
            src={initialImage}
            className={classNames(styles.initialImage, styles.clickable)}
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
  disabled: PropTypes.bool,
  onFileUploaded: PropTypes.func.isRequired,
};

export default FileSelectV2;
