const onHoverChange = theme => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
});

export const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    flex: '1 1',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      minWidth: 700,
    },
  },
  header: {
    display: 'flex',
  },
  thead: {
    display: 'flex',
    flex: '1',
  },
  row: {
    display: 'flex',
    wordBreak: 'break-word',
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  cell: {
    display: 'flex',
    flex: '1',
    alignItems: 'center',
    overflow: 'hidden',
  },
  deleteIcon: {
    '&:hover': {
      display: 'block',
      ...onHoverChange(theme),
    },
  },
  clickableText: {
    flex: 1,
    '&:hover': onHoverChange(theme),
  },
  textWithActionsContainer: {
    flex: 1,
  },
});
