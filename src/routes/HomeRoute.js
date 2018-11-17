import React, { Component, Fragment } from 'react';

class HomeRoute extends Component {
  render() {
    return (
      <Fragment>
        <div onClick={() => console.log('Hello world!')}/>
      </Fragment>
    );
  }
}

export default HomeRoute;
