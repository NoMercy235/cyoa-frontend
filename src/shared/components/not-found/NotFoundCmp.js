import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import ReturnHome from '../return-home/ReturnHome';

import styles from './NotFoundCmp.module.scss';
import sadFace from '../../../assets/sad-face.png';

class NotFoundCmp extends Component {
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
          This place seems to be long gone.&nbsp;
          <ReturnHome text="Return home"/>?
        </Typography>
      </div>
    );
  }
}

export default NotFoundCmp;
