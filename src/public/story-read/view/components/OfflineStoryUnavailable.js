import React, { Component } from 'react';

class OfflineStoryUnavailable extends Component {
  render() {
    return (
      <>
        <span>You are offline!</span>
        <p>This story is not available for offline reading. Please refresh when the connection re-establishes or try reading another story</p>
      </>
    );
  }
}

OfflineStoryUnavailable.propTypes = {
};

export default OfflineStoryUnavailable;
