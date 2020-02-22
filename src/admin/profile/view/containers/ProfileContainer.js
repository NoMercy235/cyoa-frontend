import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { appStore, appStorePropTypes } from '../../../../shared/store/AppStore';
import { storyStorePropTypes } from '../../../stories/stores/StoryStore';
import ProfileForm from '../components/ProfileForm/ProfileForm';
import { publicUserService, userService } from '../../../../infrastructure/services/UserService';
import { UserModel } from '../../../../infrastructure/models/UserModel';
import ProfileHeader from '../components/ProfileHeader/ProfileHeader';
import LoadingCmp from '../../../../shared/components/loading/LoadingCmp';

import styles from './ProfileContainer.module.scss';

@inject('storyStore', 'appStore')
@observer
class ProfileContainer extends Component {
  state = {
    canRender: false,
    userOverview: undefined,
  };

  async componentDidMount () {
    const { appStore: { user } } = this.props;
    const overview = await publicUserService.getUserOverview(user._id);
    this.setState({
      canRender: true,
      userOverview: overview,
    })
  }

  onUpdateUser = async (values, formik) => {
    const { appStore: { user, showSuccessSnackbar } } = this.props;
    try {
      const updatedUser = await userService.update(user.email, UserModel.forApi(values));
      showSuccessSnackbar({ message: 'Profile updated!' });
      appStore.setUser(updatedUser);
    } finally {
      formik.setSubmitting(false);
    }
  };

  render() {
    const { appStore: { user } } = this.props;
    const { canRender, userOverview } = this.state;

    if (!canRender) {
      return <LoadingCmp/>
    }

    return (
      <>
        <Helmet>
          <title>Rigamo | Profile</title>
        </Helmet>
        <Breadcrumb/>
        <div className={styles.container}>
          <ProfileHeader
            user={user}
            userOverview={userOverview}
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
