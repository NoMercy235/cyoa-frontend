import React, { Component, Suspense } from 'react';
import StoryContainer from './containers/StoryContainer';

class StoryRoute extends Component {
  render() {
    return (
      <>
        <Suspense fallback={<div>Fallback component</div>}>
          <StoryContainer />
        </Suspense>
      </>
    );
  }
}

export default StoryRoute;
