import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import MuiModal from '@material-ui/core/Modal';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './Modal.css';

class Modal extends Component {
  constructor (props) {
    super(props);
    if (this.props.children.length > 3) {
      console.error('Cannot have more than 3 children.');
    }
  }


  render() {
    const header = this.props.children[0];
    const body = this.props.children[1];
    const footer = this.props.children[2];

    return (
      <MuiModal
        className={this.props.backdropClasses || this.props.classes.backdrop}
        open={this.props.open}
        onBackdropClick={this.props.onBackdropClick}
      >
        <div
          className={
            this.props.containerClasses || this.props.classes.container
          }
          tabIndex={-1}
        >
          {header}
          {body}
          {footer}
        </div>
      </MuiModal>
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.object, // sent by withStyles
  backdropClasses: PropTypes.object, // sent by user
  containerClasses: PropTypes.object, // sent by user
  onBackdropClick: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(Modal);
