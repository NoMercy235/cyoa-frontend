import React from 'react';
import { Typography } from '@material-ui/core';

import fossil1 from '../../../../../assets/fossil1.png';
import fossil2 from '../../../../../assets/fossil2.png';

import styles from './StoryListEnd.module.scss';

export const StoryListEnd = () => {
  return (
    <div className={styles.container}>
      <img className={styles.fossil} alt="fossil1" src={fossil1}/>
      <div className={styles.message}>
        <Typography variant="h6">
          This is it. There's nothing more past this point.
        </Typography>
      </div>
      <img className={styles.fossil} alt="fossil1" src={fossil2}/>
    </div>
  );
};
