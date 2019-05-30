import red from '@material-ui/core/colors/red';

export const styles = theme => ({
  actions: {
    display: 'flex',
  },
  card: {
    overflow: 'visible',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  coverPic: {
    float: 'left',
    maxWidth: 300,
    maxHeight: 300,
    marginRight: theme.spacing(2),
    borderRadius: '15%',
  },
  expandedContainer: {
    padding: theme.spacing(1),
  },
  readStoryLabel: {
    marginRight: theme.spacing(1),
  },
});
