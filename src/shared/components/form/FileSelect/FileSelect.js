import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import styles from './FileSelect.module.scss';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class FileSelect extends React.Component {
  onFileUploaded = async ev => {
    const file = ev.target.files[0];

    if (file.size > 10e5) {
      console.error('File larger than 1MB');
      return;
    }

    this.props.onFileUploaded(
      await getBase64(file),
    );
  };

  render() {
    const { label, className } = this.props;

    return (
      <Fragment>
        <input
          className={styles.uploadInput}
          onChange={this.onFileUploaded}
          accept="image/*"
          id="contained-button-file"
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button
            className={className}
            variant="contained"
            component="span"
          >
            {label || 'Upload'}
          </Button>
        </label>
      </Fragment>
    );
  }
}

FileSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onFileUploaded: PropTypes.func.isRequired,
};

export default FileSelect;
