export const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    flex: '1 1',
  },
  table: {
    [theme.breakpoints.down('sm')]: {
      minWidth: 700,
    },
  },
  row: {
    wordBreak: 'break-word',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});
