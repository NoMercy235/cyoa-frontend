const onHoverChange = theme => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
});

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'auto',
    '& > div': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  paper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  clickableText: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    '&:hover': onHoverChange(theme),
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
