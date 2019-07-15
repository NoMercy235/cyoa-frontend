import { SCREEN_MAX_WIDTH_SM, SCREEN_MIN_WIDTH_MD } from '../../../../../shared/constants/global';

export const styles = theme => ({
  actions: {
    display: 'flex',
  },
  card: {
    overflow: 'visible',
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
  storyContent: {
    display: 'flex',
    flexDirection: 'column',
    [`@media (min-width: ${SCREEN_MIN_WIDTH_MD}px)`]: {
      flex: 1,
    },
  },
  cardContent: {
    flex: 1,
  },
  expandedContainer: {
    padding: theme.spacing(1),
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
