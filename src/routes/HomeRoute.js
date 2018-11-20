import React, { Component, Fragment, lazy, Suspense } from 'react';

const HomeContainer = lazy(() => import('../containers/HomeContainer'));

class HomeRoute extends Component {
  render() {
    return (
      <Fragment>
        <Suspense fallback={<div>Fallback component</div>}>
          <HomeContainer />
        </Suspense>
      </Fragment>
    );
  }
}

export default HomeRoute;
