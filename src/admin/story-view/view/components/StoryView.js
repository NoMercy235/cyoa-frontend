import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { AppBar, Tabs, Tab } from '@material-ui/core';

import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import PlayerTabContainer from '../containers/PlayerTabContainer';
import SequenceTabContainer from '../containers/SequenceTabContainer';
import GeneralTabContainer from '../containers/GeneralTabContainer';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import {
  ADMIN_STORY_VIEW_ROUTE,
  ADMIN_STORY_VIEW_ROUTE_ATTRIBUTES,
  ADMIN_STORY_VIEW_ROUTE_GENERAL,
  ADMIN_STORY_VIEW_ROUTE_SEQUENCES,
  NOT_FOUND_ROUTE,
  makePath,
  ADMIN_WRITE_STORY_ROUTE,
} from '../../../../shared/constants/routes';
import WriteStoryContainer from '../containers/WriteStoryContainer';

const TabsEnum = {
  General: 'General',
  Player: 'Player',
  Sequences: 'Sequences',
  WriteStory: 'Write Story',
};

const getCurrentTab = (story) => {
  const { location: { pathname } } = window;

  if (pathname === makePath(ADMIN_STORY_VIEW_ROUTE_ATTRIBUTES, { ':id': story._id })) {
    return TabsEnum.Player
  }
  if (pathname === makePath(ADMIN_STORY_VIEW_ROUTE_SEQUENCES, { ':id': story._id })) {
    return TabsEnum.Sequences
  }
  if (pathname === makePath(ADMIN_WRITE_STORY_ROUTE, { ':id': story._id })) {
    return TabsEnum.WriteStory
  }
  return TabsEnum.General
};

class StoryView extends Component {
  state = {
    currentTab: getCurrentTab(this.props.story),
  };

  handleChange = (event, value) => {
    const { story, history } = this.props;
    this.setState({ currentTab: value });
    let route;
    switch (value) {
      case TabsEnum.General:
        route = ADMIN_STORY_VIEW_ROUTE_GENERAL;
        break;
      case TabsEnum.Player:
        route = ADMIN_STORY_VIEW_ROUTE_ATTRIBUTES;
        break;
      case TabsEnum.Sequences:
        route = ADMIN_STORY_VIEW_ROUTE_SEQUENCES;
        break;
      case TabsEnum.WriteStory:
        route = ADMIN_WRITE_STORY_ROUTE;
        break;
      default:
    }

    history.push(makePath(route, { ':id': story._id }))
  };

  render() {
    const { currentTab } = this.state;
    const { story } = this.props;

    return (
      <>
        <Breadcrumb/>
        <AppBar position="static">
          <Tabs value={currentTab} onChange={this.handleChange}>
            <Tab value={TabsEnum.General} label={TabsEnum.General} />
            {!story.isAvailableOffline && (
              <Tab value={TabsEnum.Player} label={TabsEnum.Player} />
            )}
            <Tab value={TabsEnum.Sequences} label={TabsEnum.Sequences} />
            <Tab value={TabsEnum.WriteStory} label={TabsEnum.WriteStory} />
          </Tabs>
        </AppBar>
        <Switch>
          <Route
            exact
            path={ADMIN_STORY_VIEW_ROUTE_GENERAL}
            render={() => (
              <GeneralTabContainer story={story} />
            )}
          />
          <Route
            exact
            path={ADMIN_STORY_VIEW_ROUTE_ATTRIBUTES}
            render={() => (
              <PlayerTabContainer
                story={story}
                getAttributes={this.props.getAttributes}
              />
            )}
          />
          <Route
            exact
            path={ADMIN_STORY_VIEW_ROUTE_SEQUENCES}
            render={() => <SequenceTabContainer story={story} />}
          />
          <Route
            exact
            path={ADMIN_WRITE_STORY_ROUTE}
            render={() => <WriteStoryContainer story={story} />}
          />
          <Redirect exact from={ADMIN_STORY_VIEW_ROUTE} to={ADMIN_STORY_VIEW_ROUTE_GENERAL}/>
          <Redirect to={NOT_FOUND_ROUTE}/>
        </Switch>
      </>
    );
  }
}

StoryView.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  getAttributes: PropTypes.func.isRequired,

  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(StoryView);
