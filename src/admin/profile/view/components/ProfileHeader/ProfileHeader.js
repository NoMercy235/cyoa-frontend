import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import { UserModel } from '../../../../../infrastructure/models/UserModel';

import styles from './ProfileHeader.module.scss';

class ProfileHeader extends Component {
  render () {
    const {
      user,
      userOverview: {
        storiesWritten
      }
    } = this.props;

    return (
      <div className={styles.container}>
        <Typography
          variant="h4"
          className={styles.header}
        >
          Overview
        </Typography>
        <div>Joined on: {user.createdAtShort}</div>
        <div>Stories written: {storiesWritten}</div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  user: PropTypes.instanceOf(UserModel).isRequired,
  userOverview: PropTypes.shape({
    storiesWritten: PropTypes.number,
  }),
};

export default ProfileHeader;
