export const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  listTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
    '& > span': {
      flex: '1 1',
    },
  },
  chapterName: {
    '& > span': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  chapterAddBtn: {
    float: 'right',
  },
});
