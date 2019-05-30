import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

import { styles } from './Authentication.css';

export const NoAccount = withStyles(styles)(props => {
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
      No account? Register {here}!
    </Typography>
  );
});
