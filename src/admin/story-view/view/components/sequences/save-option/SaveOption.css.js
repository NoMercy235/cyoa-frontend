export const styles = theme => ({
  saveOptionDialog: {
    minHeight: '60vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  extraHeader: {
    display: 'flex',
    alignItems: 'center',
    '& > span': {
      flex: '1 1',
    },
  },
  extraRow: {
    display: 'flex',
    '& > div': {
      marginRight: theme.spacing(1),
    },
    '& > div:first-child': {
      flex: 6,
    },
    '& > div:nth-child(2)': {
      flex: 1,
    },
  },
  extraRemoveBtn: {
    alignSelf: 'center',
  },
  divider: {
    margin: `${theme.spacing(1)}px 0`
  }
});
