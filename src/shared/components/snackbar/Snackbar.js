import React from 'react';
import MuiSnackbar from '@material-ui/core/Snackbar';
import * as PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import { styles } from './Snackbar.css';
import { withStyles } from '@material-ui/core';
import SnackbarContent from '@material-ui/core/es/SnackbarContent/SnackbarContent';
import * as ReactDOM from 'react-dom';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

class Snackbar extends React.Component {
  getOptions() {
    return {
      variant: this.props.variant || 'info',
      vertical: this.props.vertical || 'top',
      horizontal: this.props.horizontal || 'center',
      autoHideDuration: this.props.autoHideDuration !== undefined || 2000,
    };
  }

  render() {
    const { variant, vertical, horizontal, autoHideDuration } = this.getOptions();
    const { message, open, onClose, classes } = this.props;

    const Icon = variantIcon[variant];

    return ReactDOM.createPortal(
      <MuiSnackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={onClose}
        autoHideDuration={autoHideDuration}
      >
        <SnackbarContent
          className={classes[variant]}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={onClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </MuiSnackbar>,
      document.body
    );
  }
}

Snackbar.propTypes = {
  classes: PropTypes.object,
  message: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
  horizontal: PropTypes.oneOf(['left', 'center', 'right']),
  autoHideDuration: PropTypes.number,
};

export default withStyles(styles)(Snackbar);
