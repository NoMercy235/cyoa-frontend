import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import { LANDING_ROUTE } from '../../constants/routes';

import styles from './NotFoundCmp.module.scss';
import sadFace from '../../../assets/sad-face.png';

class NotFoundCmp extends Component {
  onReturnHome = history => () => {
    history.replace(LANDING_ROUTE);
  };

  renderReturnHome = () => {
    const ReturnHomeLink = withRouter(({ history }) => (
      <span
        className={styles.goBackClickable}
        onClick={this.onReturnHome(history)}
      >
        Return home
      </span>
    ));

    return <ReturnHomeLink />;
  };

  render() {
    return (
      <div className={styles.container}>
        <img
          alt="Nothing here"
          src={sadFace}
        />
        <Typography
          className={styles.notFoundText}
          variant="subtitle1"
          color="inherit"
          noWrap
        >
          Not found
        </Typography>
        <Typography
          className={styles.goBackText}
          variant="h4"
          color="inherit"
          noWrap
        >
          This place seems to be long gone. {this.renderReturnHome()}?
        </Typography>
      </div>
    );
  }
}

export default NotFoundCmp;
