import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import { storyStorePropTypes } from '../../../stories/stores/StoryStore';
import ProfileForm from '../components/ProfileForm';
import { userService } from '../../../../infrastructure/services/UserService';
import { UserModel } from '../../../../infrastructure/models/UserModel';
import ProfileHeader from '../components/ProfileHeader';

import styles from './ProfileContainer.module.scss';

@inject('storyStore', 'appStore')
@observer
class ProfileContainer extends Component {
  componentDidMount () {
    // get user summary (nr of stories written, read, etc)
  }

  onUpdateUser = async (values, formik) => {
    const { appStore: { user, showSuccessSnackbar } } = this.props;

    try {
      await userService.update(user.email, UserModel.forApi(values));
      showSuccessSnackbar({ message: 'Profile updated!' });
    } finally {
      formik.setSubmitting(false);
    }
  };

  render() {
    const { appStore: { user } } = this.props;

    return (
      <>
        <Helmet>
          <title>Rigamo | Profile</title>
        </Helmet>
        <Breadcrumb/>
        <div className={styles.container}>
          <ProfileHeader
            user={user}
          />
          <ProfileForm
            user={user}
            onUpdateUser={this.onUpdateUser}
          />
        </div>
      </>
    );
  }
}

ProfileContainer.propTypes = {
  storyStore: storyStorePropTypes,
  appStore: appStorePropTypes,
};

export default ProfileContainer;
