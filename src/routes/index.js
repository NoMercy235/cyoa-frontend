import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import HomeRoute from './HomeRoute';

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={HomeRoute} />
        <Redirect to='/' />
      </Switch>
    );
  }
}
