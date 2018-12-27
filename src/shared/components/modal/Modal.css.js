export const styles = theme => ({
  backdrop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
  },
});
