import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';

export const TableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: '1.2rem',
  },
  body: {
    fontSize: '1rem',
  },
}))(MuiTableCell);
