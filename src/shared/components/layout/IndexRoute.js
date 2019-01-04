import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import LandingRoute from '../../../landing/view/LandingRoute';
import { withDefaultLayout } from '../../hoc/DefaultLayout';

class IndexRoute extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={LandingRoute} />
          <Redirect to='/' />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default withDefaultLayout(IndexRoute);
