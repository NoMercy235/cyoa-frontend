import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { AppBar, Tabs, Tab } from '@material-ui/core';

import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import PlayerTabContainer from '../containers/PlayerTabContainer';
import SequenceTabContainer from '../containers/SequenceTabContainer';
import GeneralTabContainer from '../containers/GeneralTabContainer';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';

const TabsEnum = {
  General: 'General',
  Player: 'Player',
  Sequences: 'Sequences',
};

class StoryView extends Component {
  state = {
    currentTab: TabsEnum.General,
  };

  handleChange = (event, value) => {
    this.setState({ currentTab: value });
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
          </Tabs>
        </AppBar>
        {currentTab === TabsEnum.General && <GeneralTabContainer story={story} />}
        {currentTab === TabsEnum.Player && (
          <PlayerTabContainer
            story={story}
            getAttributes={this.props.getAttributes}
          />
        )}
        {currentTab === TabsEnum.Sequences && (
          <SequenceTabContainer
            story={story}
          />
        )}
      </>
    );
  }
}

StoryView.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  getAttributes: PropTypes.func.isRequired,
};

export default StoryView;
