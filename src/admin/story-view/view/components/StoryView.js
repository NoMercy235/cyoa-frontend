import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PlayerTabContainer from '../containers/PlayerTabContainer';
import SequenceTabContainer from '../containers/SequenceTabContainer';
import GeneralTabContainer from '../containers/GeneralTabContainer';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';

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
        <Breadcrumb/>
        <AppBar position="static">
          <Tabs value={currentTab} onChange={this.handleChange}>
            <Tab label="General" />
            <Tab label="Player" />
            <Tab label="Sequences" />
          </Tabs>
        </AppBar>
        {currentTab === 0 && <GeneralTabContainer story={story} />}
        {currentTab === 1 && (
          <PlayerTabContainer
            story={story}
            getAttributes={this.props.getAttributes}
          />
        )}
        {currentTab === 2 && (
          <SequenceTabContainer
            story={story}
          />
        )}
      </Fragment>
    );
  }
}

StoryView.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  getAttributes: PropTypes.func.isRequired,
};

export default StoryView;
