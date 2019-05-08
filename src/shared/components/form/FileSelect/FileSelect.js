import React from 'react';
import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import styles from './FileSelect.module.scss';
import Snackbar from '../../snackbar/Snackbar';
import { ERRORS } from '../../../constants/errors';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class FileSelect extends React.Component {
  state = {
    file: '',
    base64Img: this.props.initialPreview || '',
  };
  snackbarRef = React.createRef();

  isImg = file => /^image/.test(file.type);

  checkFile = file => {
    if (file.size <= 10e5) return;

    this.snackbarRef.current.showSnackbar({
      variant: 'error',
      message: ERRORS.fileTooLarge,
    });
    throw ERRORS.fileTooLarge;
  };

  onFileUploaded = async ev => {
    const file = ev.target.files[0];

    if (!file) return;
    this.checkFile(file);

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
    const { base64Img } = this.state;

    return (
      <div className={styles.container}>
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
        <div>
          <img
            className={styles.preview}
            src={base64Img}
            alt=""
          />
        </div>

        <Snackbar innerRef={this.snackbarRef}/>
      </div>
    );
  }
}

FileSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  initialPreview: PropTypes.string,
  onFileUploaded: PropTypes.func.isRequired,
};

export default FileSelect;
