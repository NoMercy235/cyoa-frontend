import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import StoryRoute from './stories/view/StoryRoute';
import StoryViewRoute from './story-view/view/StoryViewRoute';

class AdminRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/admin/stories' component={StoryRoute} />
        <Route exact path='/admin/stories/:id' component={StoryViewRoute} />
      </Switch>
    );
  }
}

export default AdminRoute;
