import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit * 2,
    wordBreak: 'break-all',
  },
});

class ShareButton extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  onInputFocus = e => {
    e.preventDefault();
    e.target.select();
  };

  render() {
    const { anchorEl } = this.state;
    const open = !!anchorEl;
    const { classes, text } = this.props;

    return (
      <Fragment>
        <IconButton
          aria-label="Share"
          onClick={this.handleClick}
        >
          <ShareIcon />
        </IconButton>
        <Popover
          id="simple-popper"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.container}>
            <TextField
              label="URL"
              autoFocus={true}
              readOnly={true}
              value={text}
              onFocus={this.onInputFocus}
            />
          </div>
        </Popover>
      </Fragment>
    );
  }
}

ShareButton.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

export default withStyles(styles)(ShareButton);
