import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

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
      <Card className={styles.container}>
        <CardHeader
          title={<Typography variant="h4">Overview</Typography>}
        />
        <CardContent>
          <div>Joined on: {user.createdAtShort}</div>
          <div>Stories written: {storiesWritten}</div>
        </CardContent>
      </Card>
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
