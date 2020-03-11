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
    image: this.props.initialImage || '',
    pickerState: PickerStates.Select,
  };

  onFileUploaded = async file => {
    // TODO: validations
    // TODO: save image extension and use it
    const image = await getBase64FromFile(file);
    this.setState({ image, pickerState: PickerStates.Crop });
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
    const { pickerState, image } = this.state;
    const { inputId, initialImage, cropperProps } = this.props;

    switch (pickerState) {
      case PickerStates.Select:
        return (
          <FileSelectV2
            id={inputId}
            stylesProp={cropperProps.cropperProps.size}
            initialImage={initialImage}
            onFileUploaded={this.onFileUploaded}
          />
        );
      case PickerStates.Crop:
        return (
          <ImageCropper
            image={image}
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
  className: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  initialImage: PropTypes.string,
  cropperProps: PropTypes.object.isRequired,
  onFileSave: PropTypes.func.isRequired,
};

export default FilePicker;
