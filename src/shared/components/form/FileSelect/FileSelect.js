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
  state = { file: '', base64Img: '' };

  isImg = file => /^image/.test(file.type);

  onFileUploaded = async ev => {
    const file = ev.target.files[0];

    if (!file) return;

    if (file.size > 10e5) {
      console.error('File larger than 1MB');
      return;
    }

    const base64 = await getBase64(file);
    this.props.onFileUploaded(base64);

    if (this.isImg(file)) {
      this.setState({ base64Img: base64 });
    }

    this.setState({ file });
  };

  render() {
    const { className } = this.props;
    const label = this.state.file.name || this.props.label;

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
        <img src={this.state.base64Img} alt=""/>
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
