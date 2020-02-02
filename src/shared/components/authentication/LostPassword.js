import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

import { styles } from './Authentication.css';

export const LostPassword = withStyles(styles)(props => {
  const { classes, onHandleClick } = props;
  const Recover = (
    <span
      className={classes.here}
      onClick={onHandleClick}
    >
      Recover
    </span>
  );
  return (
    <Typography
      variant="caption"
      color="inherit">
      Lost password? {Recover}!
    </Typography>
  );
});
