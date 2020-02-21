import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Button, Dialog } from '@material-ui/core';

import { appStorePropTypes } from '../../store/AppStore';
import { DialogTitle } from '../dialog/Title';
import { DialogContent } from '../dialog/Content';
import { DialogActions } from '../dialog/Actions';
import { stopEvent } from '../../utilities';

import { dialogDefaultCss } from '../dialog/Dialog.css';

class ConfirmationModal extends Component {
  static defaultProps = {
    disableNoBtn: false,
    disableYesBtn: false,
    closeOnOutsideClick: false,
  };

  onClose = () => {
    const { closeOnOutsideClick, onClose } = this.props;
    closeOnOutsideClick && onClose();
  };

  render() {
    const {
      classes,
      title,
      description,
      open,
      onClose,
      onAccept,
      disableNoBtn,
      disableYesBtn,
    } = this.props;

    return (
      <Dialog
        open={open}
        onClick={stopEvent}
        onClose={this.onClose}
        classes={{ paper: classes.dialogSize }}
      >
        <DialogTitle
          onClose={onClose}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          {description}
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            onClick={onClose}
            disabled={disableNoBtn}
          >
            No
          </Button>
          <Button
            type="submit"
            onClick={onAccept}
            disabled={disableYesBtn}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmationModal.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.string, PropTypes.func, PropTypes.object,
  ]).isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string, PropTypes.func, PropTypes.object,
  ]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  disableNoBtn: PropTypes.bool,
  disableYesBtn: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  appStore: appStorePropTypes,
};

export default withStyles(dialogDefaultCss)(ConfirmationModal);
