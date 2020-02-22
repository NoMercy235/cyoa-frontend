import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import LandingContainer from './landing/view/containers/LandingContainer';
import { LANDING_ROUTE, NOT_FOUND_ROUTE, READ_STORY_ROUTE } from '../shared/constants/routes';
import ReadStoryContainer from './story-read/view/containers/ReadStoryContainer';

class PublicRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={LANDING_ROUTE} component={LandingContainer} />
        <Route exact path={READ_STORY_ROUTE} component={ReadStoryContainer} />
        <Redirect to={NOT_FOUND_ROUTE}/>
      </Switch>
    );
  }
}

export default PublicRoute;
