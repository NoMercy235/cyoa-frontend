import React, { Component, Suspense } from 'react';
import StoryViewContainer from './containers/StoryViewContainer';

class StoryViewRoute extends Component {
  render() {
    return (
      <>
        <Suspense fallback={<div>Fallback component</div>}>
          <StoryViewContainer />
        </Suspense>
      </>
    );
  }
}

export default StoryViewRoute;
