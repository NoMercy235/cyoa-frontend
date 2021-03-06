import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

import { UserModel } from '../../../../../infrastructure/models/UserModel';
import FilePicker from '../../../../../shared/components/form/FileSelect/FilePicker';
import { publicUserService } from '../../../../../infrastructure/services/UserService';
import {
  EDITABLE_PROFILE_SIZE,
  MAX_PROFILE_SCENE_PIC_SIZE_MB,
  PROFILE_PIC_SIZE_MD,
} from '../../../../../shared/constants/profile';

import styles from './ProfileHeader.module.scss';
import notFoundImg from '../../../../../assets/notfound.png';

const compressOptions = {
  maxSizeMB: MAX_PROFILE_SCENE_PIC_SIZE_MB,
  maxWidthOrHeight: EDITABLE_PROFILE_SIZE.height,
};

class ProfileHeader extends Component {
  state = {
    profile: undefined,
  };

  async componentDidMount () {
    const { user } = this.props;
    const { profile } = await publicUserService.getProfilePicture(user._id);
    this.setState({ profile });
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
        storiesWritten,
      },
    } = this.props;
    const { profile } = this.state;

    return (
      <Card className={styles.container}>
        <CardHeader
          title={<Typography variant="h4">Overview</Typography>}
        />
        <CardContent>
          <FilePicker
            className={styles.imagePicker}
            inputId="profile-picture"
            initialImage={profile || notFoundImg}
            cropperProps={{
              size: EDITABLE_PROFILE_SIZE,
              cropperProps: {
                size: PROFILE_PIC_SIZE_MD,
              },
            }}
            compressOptions={compressOptions}
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
