import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

import { UserModel } from '../../../../../infrastructure/models/UserModel';
import FilePicker from '../../../../../shared/components/form/FileSelect/FilePicker';
import { publicUserService } from '../../../../../infrastructure/services/UserService';

import styles from './ProfileHeader.module.scss';
import notFoundImg from '../../../../../assets/notfound.png';

class ProfileHeader extends Component {
  state = {
    profile: undefined,
  };

  async componentDidMount () {
    const { user } = this.props;
    const { profile } = await publicUserService.getProfilePicture(user._id);
    this.setState({ profile })
  }

  onProfileSave = async (img) => {
    const { onUpdateProfilePicture } = this.props;
    await onUpdateProfilePicture(img);
    this.setState({ profile: img });
  };

  render () {
    const {
      user,
      userOverview: {
        storiesWritten
      }
    } = this.props;
    const { profile } = this.state;

    return (
      <Card className={styles.container}>
        <CardHeader
          title={<Typography variant="h4">Overview</Typography>}
        />
        <CardContent>
          <FilePicker
            inputId="profile-picture"
            initialImage={profile || notFoundImg}
            cropperProps={{
              size: { height: 500, width: 500 },
              cropperProps: {
                size: { height: 300, width: 400 },
              }
            }}
            onFileSave={this.onProfileSave}
          />
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
  onUpdateProfilePicture: PropTypes.func.isRequired,
};

export default ProfileHeader;
