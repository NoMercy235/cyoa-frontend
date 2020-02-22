import React, { Component, Suspense } from 'react';

import ProfileContainer from './containers/ProfileContainer';

class ProfileRoute extends Component {
  render() {
    return (
      <Suspense fallback={<div>Fallback component</div>}>
        <ProfileContainer />
      </Suspense>
    );
  }
}

export default ProfileRoute;
