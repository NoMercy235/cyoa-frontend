export const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  listTitle: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 3),
    '& > span': {
      flex: '1 1',
    },
  },
  listItem: {
    height: theme.spacing(7),
    '& > div[class*="MuiListItemText-root"]': {
      paddingLeft: 0,
      wordBreak: 'break-all',
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
