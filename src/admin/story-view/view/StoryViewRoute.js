import React, { Component, Fragment, Suspense } from 'react';
import StoryViewContainer from './containers/StoryViewContainer';

class StoryViewRoute extends Component {
  render() {
    return (
      <Fragment>
        <Suspense fallback={<div>Fallback component</div>}>
          <StoryViewContainer />
        </Suspense>
      </Fragment>
    );
  }
}

export default StoryViewRoute;
