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
import { BaseModel } from '../../../infrastructure/models/BaseModel';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

class Snackbar extends React.Component {
  static defaultProps = {
    autoHideDuration: 2000,
  };

  state = {
    // snackbar
    open: false,
    variant: 'success',
    message: '',
    vertical: 'top',
    horizontal: 'center',
  };

  executeAndShowSnackbar = async (foo, args, options) => {
    try {
      const result = await foo(...args);
      this.showSnackbar(options);
      return result;
    } catch (e) {
      this.setState({
        open: true,
        variant: 'error',
        message: BaseModel.handleError(e),
      });
      throw e;
    }
  };

  showSnackbar = options => {
    this.setState({
      open: true,
      ...options,
    });
  };

  onCloseSnackbar = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, autoHideDuration } = this.props;
    const {
      message,
      open,
      variant,
      vertical,
      horizontal,
    } = this.state;

    const Icon = variantIcon[variant];

    return ReactDOM.createPortal(
      <MuiSnackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={this.onCloseSnackbar}
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
              onClick={this.onCloseSnackbar}
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
  autoHideDuration: PropTypes.number,
};

export default withStyles(styles)(Snackbar);
