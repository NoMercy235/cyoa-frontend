import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingContainer from './containers/LandingContainer';
import { READ_STORY_ROUTE } from '../../shared/constants/routes';

class ReadStory extends Component {
  render() {
    return (
      <span>read me</span>
    );
  }
}


class LandingRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/public' component={LandingContainer} />
        <Route path={READ_STORY_ROUTE} component={ReadStory} />
      </Switch>
    );
  }
}

export default LandingRoute;
