import React, { Component, Fragment, lazy, Suspense } from 'react';

const LandingContainer = lazy(() => import('./containers/LandingContainer'));

class LandingRoute extends Component {
  render() {
    return (
      <Fragment>
        <Suspense fallback={<div>Fallback component</div>}>
          <LandingContainer />
        </Suspense>
      </Fragment>
    );
  }
}

export default LandingRoute;
