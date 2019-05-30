import { withStyles, DialogContent as MuiDialogContent } from '@material-ui/core';

export const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
