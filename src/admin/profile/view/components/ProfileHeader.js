import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import { UserModel } from '../../../../infrastructure/models/UserModel';

import styles from './ProfileHeader.module.scss';

class ProfileHeader extends Component {
  render () {
    const {
      user,
    } = this.props;
    console.log(user);

    return (
      <div className={styles.container}>
        <Typography variant="h4">
          Overview
        </Typography>
        <div>Joined on: {user.createdAtShort}</div>
        <div>Stories written: TODO</div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {
  user: PropTypes.instanceOf(UserModel).isRequired
};

export default ProfileHeader;
