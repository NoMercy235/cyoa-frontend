import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import StoryRoute from './stories/view/StoryRoute';

class AdminRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/admin/stories' component={StoryRoute} />
      </Switch>
    );
  }
}

export default AdminRoute;
