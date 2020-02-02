import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

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
      variant="caption"
      color="inherit">
      Already have an account? Login {here}!
    </Typography>
  );
});
