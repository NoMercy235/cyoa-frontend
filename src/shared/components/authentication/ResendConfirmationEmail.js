import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

import { styles } from './Authentication.css';

export const ResendConfirmationEmail = withStyles(styles)(props => {
  const { classes, onHandleClick } = props;
  return (
    <Typography
      className={classes.action}
      onClick={onHandleClick}
      variant="caption"
      color="inherit"
    >
      Resend confirmation email to the address
    </Typography>
  );
});
