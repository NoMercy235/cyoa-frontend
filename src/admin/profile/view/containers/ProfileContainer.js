import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import { storyStorePropTypes } from '../../../stories/stores/StoryStore';

@inject('storyStore', 'appStore')
@observer
class ProfileContainer extends Component {
  componentDidMount () {
    // GET profile
  }

  render() {
    return (
      <>
        <Helmet>
          <title>Rigamo | Profile</title>
        </Helmet>
        <Breadcrumb/>
        <div>
          Profile page
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
