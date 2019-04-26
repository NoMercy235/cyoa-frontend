import { fade } from '@material-ui/core/styles/colorManipulator';
import { SCREEN_MIN_WIDTH_LG } from '../../../../../shared/constants/global';

export const styles = theme => ({
  search: {
    marginRight: theme.spacing.unit * 2,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
  advancedFilters: {
    cursor: 'pointer',
    margin: `0 ${theme.spacing.unit}px`,
  },
  advancedFiltersBadge: {
    '& > span': {
      top: -theme.spacing.unit,
      right: -theme.spacing.unit * 0.25,
      height: theme.spacing.unit * 2,
      width: theme.spacing.unit * 2,
    },
  },
  advancedFiltersDrawer: {
    [`@media (min-width: ${SCREEN_MIN_WIDTH_LG}px)`]: {
      width: '50%',
      left: '25%',
    },
  },
});
