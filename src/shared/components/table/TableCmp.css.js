const onHoverChange = theme => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
});

export const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  clickableText: {
    flex: 1,
    '&:hover': onHoverChange(theme),
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
