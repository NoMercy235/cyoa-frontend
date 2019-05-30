import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Button, Dialog } from '@material-ui/core';

import { DialogTitle } from '../dialog/Title';
import { DialogContent } from '../dialog/Content';
import { DialogActions } from '../dialog/Actions';

import { dialogDefaultCss } from '../dialog/Dialog.css';
import { styles } from './Help.css';

class HelpModal extends Component {
  render() {
    const { classes, title, description, open, onClose } = this.props;

    return (
      <Dialog
        open={open}
        onClose={onClose}
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
            type="submit"
            onClick={onClose}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

HelpModal.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.string, PropTypes.func, PropTypes.object,
  ]).isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string, PropTypes.func, PropTypes.object,
  ]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...styles(theme),
  ...dialogDefaultCss(theme),
}))(HelpModal);
