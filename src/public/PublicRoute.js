import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingContainer from './landing/view/containers/LandingContainer';
import { LANDING_ROUTE, READ_STORY_ROUTE, STORY_ENDING_ROUTE } from '../shared/constants/routes';
import ReadStoryContainer from './story-read/view/containers/ReadStoryContainer';
import PlayerDead from './story-read/view/components/ending/PlayerDead';

class PublicRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={LANDING_ROUTE} component={LandingContainer} />
        <Route exact path={READ_STORY_ROUTE} component={ReadStoryContainer} />
        <Route exact path={STORY_ENDING_ROUTE} component={PlayerDead} />
      </Switch>
    );
  }
}

export default PublicRoute;
