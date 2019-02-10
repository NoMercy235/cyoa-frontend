import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingContainer from './landing/view/containers/LandingContainer';
import { LANDING_ROUTE, READ_STORY_ROUTE } from '../shared/constants/routes';
import ReadStoryContainer from './story-read/view/containers/ReadStoryContainer';

class PublicRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={LANDING_ROUTE} component={LandingContainer} />
        <Route path={READ_STORY_ROUTE} component={ReadStoryContainer} />
      </Switch>
    );
  }
}

export default PublicRoute;
