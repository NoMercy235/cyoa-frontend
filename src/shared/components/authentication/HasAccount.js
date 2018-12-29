import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { styles } from './Authentication.css';

export const HasAccount = withStyles(styles)(props => {
  const { classes, onHandleClick } = props;
  const here = (
    <span
      className={classes.here}
      onClick={onHandleClick}
    >
      here
    </span>
  );
  return (
    <Typography
      className={classes.helperText}
      variant="caption"
      color="inherit">
      Already have an account? Login {here}!
    </Typography>
  );
});
