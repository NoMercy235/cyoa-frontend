import { withStyles, DialogActions as MuiDialogActions } from '@material-ui/core';

export const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
