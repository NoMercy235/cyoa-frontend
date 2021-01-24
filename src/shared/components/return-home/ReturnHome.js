import React from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';

import { LANDING_ROUTE } from '../../constants/routes';

import styles from './ReturnHome.module.scss';

const renderReturnHome = ({ history, text, variant, overwriteHistory = true }) => {
  const onReturnHome = () => {
    if (overwriteHistory) {
      history.replace(LANDING_ROUTE);
    } else {
      history.push(LANDING_ROUTE);
    }
  };

  const props = {
    className: styles.clickable,
    onClick: onReturnHome,
  };

  if (!variant) {
    return (
      <span {...props}>
        {text}
      </span>
    );
  }
  
  return (
    <Typography
      variant={variant}
      {...props}
    >
      {text}
    </Typography>
  );
};

export default withRouter(renderReturnHome);
