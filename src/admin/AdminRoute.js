import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import StoryRoute from './stories/view/StoryRoute';
import StoryViewRoute from './story-view/view/StoryViewRoute';
import ProfileRoute from './profile/view/ProfileRoute';
import {
  ADMIN_PROFILE_ROUTE,
  ADMIN_ROUTE,
  ADMIN_STORIES_ROUTE,
  ADMIN_STORY_VIEW_ROUTE,
  NOT_FOUND_ROUTE
} from '../shared/constants/routes';

class AdminRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={ADMIN_STORIES_ROUTE} component={StoryRoute} />
        <Route exact path={ADMIN_STORY_VIEW_ROUTE} component={StoryViewRoute} />
        <Route exact path={ADMIN_PROFILE_ROUTE} component={ProfileRoute} />
        <Redirect exact from={ADMIN_ROUTE} to={ADMIN_STORIES_ROUTE}/>
        <Redirect to={NOT_FOUND_ROUTE}/>
      </Switch>
    );
  }
}

export default AdminRoute;
