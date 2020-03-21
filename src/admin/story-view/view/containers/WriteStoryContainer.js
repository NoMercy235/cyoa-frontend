import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import WriteStoryComponent from '../components/write-story/write-story/WriteStoryComponent';
import { sequenceService } from '../../../../infrastructure/services/SequenceService';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import LoadingCmp from '../../../../shared/components/loading/LoadingCmp';
import { optionService } from '../../../../infrastructure/services/OptionService';

@inject('storyViewStore')
@observer
class WriteStoryContainer extends Component {
  state = {
    canRender: false,
  };

  async componentDidMount () {
    await Promise.all([
      this.getSequences(),
      this.getOptions(),
    ]);
    this.setState({ canRender: true })
  }

  getSequences = async () => {
    const {
      storyViewStore,
      story,
    } = this.props;

    const params = { ':story': story._id };
    sequenceService.setNextRouteParams(params);
    const sequences = await sequenceService.list();
    storyViewStore.setSequences(sequences);
  };

  getOptions = async () => {
    const { story, storyViewStore } = this.props;
    const options = await optionService.getAllStoryOptions(story._id);
    storyViewStore.setAllStoryOptions(options);
  };

  onEditSequence = (seqId) => {
    console.log(seqId);
  };

  onEditOption = (optionId) => {
    console.log(optionId);
  };

  render() {
    const {
      storyViewStore: {
        currentStory,
        sequences,
        allStoryOptions,
      },
    } = this.props;
    const { canRender } = this.state;

    if (!canRender) {
      return <LoadingCmp/>
    }

    return (
      <WriteStoryComponent
        story={currentStory}
        sequences={sequences}
        options={allStoryOptions}
        onEditSequence={this.onEditSequence}
        onEditOption={this.onEditOption}
      />
    );
  }
}

WriteStoryContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default WriteStoryContainer;
