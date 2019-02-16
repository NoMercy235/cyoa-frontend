import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from '../dialog/Title';
import { DialogContent } from '../dialog/Content';
import { DialogActions } from '../dialog/Actions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { styles } from './Help.css';

class ConfirmationModal extends Component {
  render() {
    const { title, description } = this.props;

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        classes={{ paper: this.props.classes.dialogSize }}
      >
        <DialogTitle
          onClose={this.props.onClose}
        >
          {title}
        </DialogTitle>
        <DialogContent>
          {description}
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            onClick={this.props.onClose}
          >
            Got it
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
};

export default withStyles(styles, { withTheme: true })(ConfirmationModal);
