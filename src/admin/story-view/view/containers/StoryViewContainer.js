import React, { Component, Fragment } from 'react';
import { storyService } from '../../../../infrastructure/services/StoryService';
import StoryView from '../components/StoryView';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import { attributeService } from '../../../../infrastructure/services/AttributeService';
import { sequenceService } from '../../../../infrastructure/services/SequenceService';

@inject('storyViewStore')
@observer
class StoryViewContainer extends Component {
  async fetchStory(storyId) {
    const story = (await storyService.get(storyId));
    this.props.storyViewStore.setCurrentStory(story);
  }

  getAttributes = async () => {
    const params = { ':story': this.props.match.params.id };
    attributeService.setNextRouteParams(params);
    const attributes = await attributeService.list();
    this.props.storyViewStore.setAttributes(attributes);
  };

  getSequences = async () => {
    const params = { ':story': this.props.match.params.id };
    sequenceService.setNextRouteParams(params);
    const sequences = await sequenceService.list(
      {},
      { order: 'asc' },
    );
    this.props.storyViewStore.setSequences(sequences);
  };

  componentDidMount () {
    this.getAttributes();
    this.fetchStory(this.props.match.params.id);
    this.getSequences();
  }

  componentWillUnmount () {
    this.props.storyViewStore.reset();
  }

  render() {
    const { currentStory } = this.props.storyViewStore;

    if (!currentStory) {
      return <span>Loading...</span>;
    }

    return (
      <Fragment>
        <StoryView
          story={currentStory}
          getAttributes={this.getAttributes}
          getSequences={this.getSequences}
        />
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
