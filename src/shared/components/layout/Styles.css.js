import { SCREEN_MAX_WIDTH_SM } from '../../constants/global';

const drawerWidth = 240;

export const styles = theme => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  appBar: {
    zIndex: 1101, // Fix for header displaying under page elements
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appTitle: {
    flexGrow: 1,
  },
  authButton: {
    marginRight: theme.spacing.unit * 3,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  sideMenu: {
    width: drawerWidth,
    flexShrink: 0,
    [`@media (max-width: ${SCREEN_MAX_WIDTH_SM}px)`]: {
      width: '100%',
    },
  },
  sideMenuHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100vh',
    overflow: 'auto',
    flexGrow: 1,
    marginTop: theme.spacing.unit * 8,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  modalContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
