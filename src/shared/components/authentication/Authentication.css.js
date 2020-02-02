export const styles = theme => ({
  errorText: {
    marginTop: theme.spacing(2),
    display: 'block',
  },
  helperTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  here: {
    color: theme.palette.primary.dark,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  userEmail: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
