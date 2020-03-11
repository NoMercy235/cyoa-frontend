import React from 'react';
import * as PropTypes from 'prop-types';

import ImageCropper from './ImageCropper';
import { getBase64FromFile } from './fileHelpers';
import FileSelectV2 from './FileSelectV2';
import ImagePreview from './ImagePreview';

const PickerStates = {
  Select: 'SELECT',
  Crop: 'CROP',
  Preview: 'PREVIEW',
};

class FilePicker extends React.Component {
  state = {
    file: undefined,
    image: this.props.initialImage || '',
    pickerState: PickerStates.Select,
  };

  onFileUploaded = async file => {
    // TODO: validations
    const image = await getBase64FromFile(file);
    this.setState({
      file,
      image,
      pickerState: PickerStates.Crop
    });
  };

  onPreviewImage = (image) => {
    this.setState({ image, pickerState: PickerStates.Preview });
  };

  onSave = async () => {
    const { image } = this.state;
    const { onFileSave } = this.props;
    await onFileSave(image);
    this.setState({ pickerState: PickerStates.Select });
  };

  onCancel = () => {
    this.setState({ pickerState: PickerStates.Select });
  };

  render() {
    const { file, pickerState, image } = this.state;
    const { className, inputId, initialImage, cropperProps } = this.props;

    switch (pickerState) {
      case PickerStates.Select:
        return (
          <FileSelectV2
            id={inputId}
            className={className}
            initialImage={initialImage}
            onFileUploaded={this.onFileUploaded}
          />
        );
      case PickerStates.Crop:
        return (
          <ImageCropper
            image={image}
            imageType={file.type}
            {...cropperProps}
            onPreview={this.onPreviewImage}
            onCancel={this.onCancel}
          />
        );
      case PickerStates.Preview:
      default:
        return (
          <ImagePreview
            image={image}
            size={{ ...(cropperProps.cropperProps.size) }}
            onSave={this.onSave}
            onCancel={this.onCancel}
          />
        );
    }
  }
}

FilePicker.propTypes = {
  className: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  initialImage: PropTypes.string,
  cropperProps: PropTypes.object.isRequired,
  onFileSave: PropTypes.func.isRequired,
};

export default FilePicker;
