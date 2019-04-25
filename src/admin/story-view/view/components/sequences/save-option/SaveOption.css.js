export const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  nextSeq: {
    flex: '1 1',
  },
  consequenceHeader: {
    display: 'flex',
    alignItems: 'center',
    '& > span': {
      flex: '1 1',
    },
  },
  consequenceRow: {
    display: 'flex',
  },
  consequenceAttribute: {
    flex: '3 3',
    marginRight: theme.spacing.unit,
  },
  consequenceChangeValue: {
    flex: '1 1',
  },
  consequenceRemoveBtn: {
    alignSelf: 'center',
  },
});
