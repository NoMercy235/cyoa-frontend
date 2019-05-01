import { createMuiTheme } from '@material-ui/core';
import { SCREEN_MAX_WIDTH_SM } from '../../constants/global';

const onHoverChange = theme => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
});

export const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'none',
        overflowX: 'hidden',
        [`@media (max-width: ${SCREEN_MAX_WIDTH_SM}px)`]: {
          overflowX: 'auto',
        },
      },
    },
  },
});

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    overflow: 'auto',

    '& > div': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  paper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  clickableText: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    '&:hover': onHoverChange(theme),
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
