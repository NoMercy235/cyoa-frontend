import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { appStorePropTypes } from '../../store/AppStore';
import Dialog from '@material-ui/core/Dialog';
import { DialogTitle } from '../dialog/Title';
import { DialogContent } from '../dialog/Content';
import { DialogActions } from '../dialog/Actions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import { styles } from './ConfirmationModal.css';

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
            color="secondary"
            onClick={this.props.onClose}
          >
            No
          </Button>
          <Button
            type="submit"
            onClick={this.props.onAccept}
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
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  appStore: appStorePropTypes,
};

export default withStyles(styles, { withTheme: true })(ConfirmationModal);
