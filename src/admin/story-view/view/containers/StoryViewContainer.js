import React, { Component, Fragment } from 'react';
import { storyService } from '../../../stories/domain/services/StoryService';
import StoryView from '../components/StoryView';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject } from 'mobx-react';
import { storyViewStorePropTypes } from '../../domain/stores/StoryViewStore';

@inject('storyViewStore')
class StoryViewContainer extends Component {
  state= {
    story: null,
  };

  async fetchStory(storyId) {
    const story = (await storyService.get(storyId));
    this.setState({ story });
  }

  componentDidMount () {
    this.fetchStory(this.props.match.params.id);
  }

  componentWillUnmount () {
    this.props.storyViewStore.reset();
  }

  render() {
    if (!this.state.story) {
      return <span>Loading...</span>;
    }

    return (
      <Fragment>
        <StoryView story={this.state.story} />
      </Fragment>
    );
  }
}

StoryViewContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  storyViewStore: storyViewStorePropTypes,
};

export default withRouter(StoryViewContainer);
