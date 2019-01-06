import React, { Component, Fragment, Suspense } from 'react';
import StoryContainer from './containers/StoryContainer';

class StoryRoute extends Component {
  render() {
    return (
      <Fragment>
        <Suspense fallback={<div>Fallback component</div>}>
          <StoryContainer />
        </Suspense>
      </Fragment>
    );
  }
}

export default StoryRoute;
