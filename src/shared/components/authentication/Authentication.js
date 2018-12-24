import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  container: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class Authentication extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div
        className={classes.container}
        tabIndex={-1}
      >
        <Typography variant="h6" id="modal-title">
          Text in a modal
        </Typography>
        <Typography variant="subtitle1" id="modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </div>
    );
  }
}

Authentication.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Authentication);
