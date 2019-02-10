import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PlayerTabContainer from '../containers/PlayerTabContainer';
import SequenceTabContainer from '../containers/SequenceTabContainer';

class StoryView extends Component {
  state = {
    currentTab: 0,
  };

  handleChange = (event, value) => {
    this.setState({ currentTab: value });
  };

  render() {
    const { currentTab } = this.state;
    const { story } = this.props;

    return (
      <Fragment>
        <AppBar position="static">
          <Tabs value={currentTab} onChange={this.handleChange}>
            <Tab label="Player" />
            <Tab label="Sequences" />
          </Tabs>
        </AppBar>
        {currentTab === 0 && <PlayerTabContainer story={story} />}
        {currentTab === 1 && <SequenceTabContainer story={story} />}
      </Fragment>
    );
  }
}

StoryView.propTypes = {
  story: PropTypes.shape(StoryModel),
};

export default StoryView;
