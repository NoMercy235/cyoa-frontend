export const styles = theme => ({
  errorText: {
    marginTop: theme.spacing(2),
    display: 'block',
  },
  helperTextContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  action: {
    color: theme.palette.primary.dark,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  userEmail: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
