import { BORDER, SCREEN_MAX_WIDTH_SM, SCREEN_MIN_WIDTH_MD } from '../../../../../shared/constants/global';

export const styles = theme => ({
  actions: {
    display: 'flex',
    paddingBottom: 0,
  },
  card: {
    overflow: 'visible',
    '&:not(:last-child)': {
      margin: '1px', // needed for the border shadowing
      marginBottom: theme.spacing(1),
    }
  },
  visibleContent: {
    display: 'flex',
    [`@media (max-width: ${SCREEN_MAX_WIDTH_SM}px)`]: {
      flexDirection: 'column',
    },
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
    backgroundColor: theme.palette.primary.main,
  },
  storyCover: {
    [`@media (max-width: ${SCREEN_MAX_WIDTH_SM}px)`]: {
      width: '100%',
    },
    [`@media (min-width: ${SCREEN_MIN_WIDTH_MD}px)`]: {
      flex: `0 0 ${theme.spacing(30)}px`,
      alignSelf: 'flex-start',
    },
  },
  storySummary: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0,
    '& > li:nth-of-type(2)': {
      paddingTop: theme.spacing(1),
    },
    [`@media (max-width: ${SCREEN_MAX_WIDTH_SM}px)`]: {
      borderBottom: BORDER,
    },
  },
  summaryListItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  storyContent: {
    display: 'flex',
    flexDirection: 'column',
    [`@media (min-width: ${SCREEN_MIN_WIDTH_MD}px)`]: {
      borderLeft: BORDER,
      flex: 1,
    },
  },
  cardContent: {
    flex: 1,
  },
  expandedContainer: {
    padding: theme.spacing(1),
    borderTop: BORDER,
  },
  readStoryLabel: {
    marginRight: theme.spacing(1),
  },
  storyTitle: {
    '&:hover': {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  },
});
