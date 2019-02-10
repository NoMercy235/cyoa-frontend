import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import StoryRoute from './stories/view/StoryRoute';
import StoryViewRoute from './story-view/view/StoryViewRoute';
import { ADMIN_STORIES_ROUTE, ADMIN_STORY_VIEW_ROUTE } from '../shared/constants/routes';

class AdminRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={ADMIN_STORIES_ROUTE} component={StoryRoute} />
        <Route exact path={ADMIN_STORY_VIEW_ROUTE} component={StoryViewRoute} />
      </Switch>
    );
  }
}

export default AdminRoute;
