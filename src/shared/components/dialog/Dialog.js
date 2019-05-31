import React from 'react';
import { Dialog as MuiDialog } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { getMainMuiTheme } from '../../utilities';

export const Dialog = (props => {
  const { children } = props;
  return (
    <ThemeProvider theme={getMainMuiTheme()}>
      <MuiDialog {...props}>{children}</MuiDialog>
    </ThemeProvider>
  );
});
