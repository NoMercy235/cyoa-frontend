const BORDER_SIZE = 1;

export const styles = theme => ({
  tooltip: {
    fontSize: theme.typography.pxToRem(12),
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'white',
    border: `${BORDER_SIZE}px solid black`,
    padding: 0,
    height: 'auto',
    maxWidth: 'unset',
  },
  loading: {
    padding: theme.spacing(1),
  },
  tooltipContentContainer: {
    display: 'flex',
    height: '100%',
  },
  authorNameContainer: {
    padding: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
  authorName: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});
