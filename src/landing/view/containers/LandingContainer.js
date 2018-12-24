import React, { Component } from 'react';
import { withDefaultLayout } from '../../../shared/hoc/DefaultLayout';
import LandingCmp from '../components/LandingCmp';

class LandingContainer extends Component {
  render() {
    return (
      <LandingCmp />
    );
  }
}

LandingContainer.propTypes = {
};

export default withDefaultLayout(LandingContainer);
