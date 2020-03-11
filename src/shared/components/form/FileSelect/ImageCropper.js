import React, { useCallback, useState } from 'react';
import * as PropTypes from 'prop-types';
import Cropper from 'react-easy-crop'
import { Button } from '@material-ui/core';

import { getCroppedImg } from './fileHelpers';

import * as styles from './ImageCropper.module.scss';

const ImageCropper = ({
  image,
  size,
  cropperProps = {},
  onCropSelected,
  onPreview,
  onCancel,
}) => {
  const [crop, setCrop] = useState(cropperProps.initialCrop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(cropperProps.initialZoom || 1);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropChange = crop => {
    setCrop(crop)
  };

  const onCropComplete = useCallback(async (croppedArea, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(
      image,
      croppedAreaPixels
    );
    setCroppedImage(croppedImage);
    onCropSelected && onCropSelected(croppedImage);
  }, [image, onCropSelected]);

  const onZoomChange = zoom => {
    setZoom(zoom)
  };

  const onPreviewImage = () => {
    onPreview(croppedImage);
  };

  return (
    <>
      <div
        style={{
          position: 'relative',
          height: `${size.height}px`,
          width: `${size.width}px`,
        }}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={cropperProps.aspect}
          cropSize={cropperProps.size}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </div>
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
          onClick={onPreviewImage}
        >
          Preview
        </Button>
      </div>
    </>
  );
};

ImageCropper.propTypes = {
  image: PropTypes.string.isRequired,
  size: PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  }).isRequired,
  cropperProps: PropTypes.shape({
    size: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }).isRequired,
    aspect: PropTypes.number,
    initialCrop: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    initialZoom: PropTypes.number,
  }).isRequired,
  onCropSelected: PropTypes.func,
  onPreview: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ImageCropper;
