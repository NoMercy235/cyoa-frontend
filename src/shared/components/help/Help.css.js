export const styles = theme => ({
  dialogSize: {
    minWidth: '40vw',
    maxWidth: '40vw',
  },
  helpBtn: {
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.primary.light,
    },
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
});
