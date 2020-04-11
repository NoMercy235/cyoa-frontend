export const styles = theme => ({
  saveOptionDialog: {
    minHeight: '60vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  extraSectionContainer: {
    display: 'flex',
    marginTop: theme.spacing(2),
    '& > div': {
      flex: 1,
    },
    '& > div:first-of-type': {
      marginRight: theme.spacing(1),
    },
  },
  extraRow: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    '& > div': {
      marginRight: theme.spacing(1),
    },
    '& > div:first-child': {
      flex: 3,
    },
    '& > div:nth-child(2)': {
      flex: 1,
    },
  },
  extraAddNewItem: {
    marginTop: theme.spacing(1),
  },
  extraRemoveBtn: {
    alignSelf: 'center',
  },
});
