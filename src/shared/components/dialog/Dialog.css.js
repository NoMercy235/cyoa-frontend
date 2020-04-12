import { SCREEN_MAX_WIDTH_SM } from '../../constants/global';

export const dialogDefaultCss = theme => ({
  dialogSize: {
    width: '80vw',
    [`@media (max-width: ${SCREEN_MAX_WIDTH_SM}px)`]: {
      width: '100vw',
      margin: theme.spacing(1),
    },
  },
});
