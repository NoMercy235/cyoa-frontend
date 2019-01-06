import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import LandingRoute from '../../../landing/view/LandingRoute';
import { withDefaultLayout } from '../../hoc/DefaultLayout';
import AdminRoute from '../../../admin/AdminRoute';

class IndexRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={LandingRoute} />
        <Route path='/admin' component={AdminRoute} />
        <Redirect to='/' />
      </Switch>
    );
  }
}

export default withDefaultLayout(IndexRoute);
