import { fade } from '@material-ui/core/styles/colorManipulator';
import { SCREEN_MIN_WIDTH_LG } from '../../../../../shared/constants/global';

export const styles = theme => ({
  search: {
    marginRight: theme.spacing(2),
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(4),
      paddingLeft: theme.spacing(1),
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(5),
    },
  },
  advancedFilters: {
    cursor: 'pointer',
    margin: theme.spacing(0, 1),
  },
  advancedFiltersBadge: {
    '& > span': {
      top: theme.spacing(1),
      right: theme.spacing(0.5),
      height: theme.spacing(2),
      width: theme.spacing(2),
    },
  },
  advancedFiltersDrawer: {
    [`@media (min-width: ${SCREEN_MIN_WIDTH_LG}px)`]: {
      width: '50%',
      left: '25%',
    },
  },
});
