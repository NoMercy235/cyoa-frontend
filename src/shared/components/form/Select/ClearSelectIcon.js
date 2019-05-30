import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const styles = {
  icon: {
    top: 'calc(50% - 12px)',
    right: 0,
    color: 'rgba(0, 0, 0, 0.54)',
    position: 'absolute',
    '&:hover': {
      cursor: 'pointer',
    },
  },
};


class ClearSelectIcon extends Component {
  onClick = e => {
    e.stopPropagation();
    this.props.onClick();
  };

  render() {
    return (
      <CloseIcon
        className={this.props.classes.icon}
        onClick={this.onClick}
      >
        {this.props.children}
      </CloseIcon>
    );
  }
}

ClearSelectIcon.propTypes = {
  classes: PropTypes.object,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(ClearSelectIcon);
