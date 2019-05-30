import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';

export const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
