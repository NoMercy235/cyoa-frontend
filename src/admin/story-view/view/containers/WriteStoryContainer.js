import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import WriteStoryComponent from '../components/write-story/write-story/WriteStoryComponent';
import { sequenceService } from '../../../../infrastructure/services/SequenceService';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import LoadingCmp from '../../../../shared/components/loading/LoadingCmp';
import { optionService } from '../../../../infrastructure/services/OptionService';
import { socket } from '../../../../infrastructure/sockets/setup';
import { SocketEvents } from '../../../../shared/constants/events';
import { SequenceModel } from '../../../../infrastructure/models/SequenceModel';
import { storyService } from '../../../../infrastructure/services/StoryService';

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
    this.setState({ canRender: true });
    this.setupSocketResponses();
  }
  setupSocketResponses = () => {
    const { storyViewStore } = this.props;
    socket.on(SocketEvents.NewSequenceResponse, seq => {
      storyViewStore.addSequence(new SequenceModel(seq));
    });
  };

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

  updateStoryStartSeq = async seq => {
    const { storyViewStore, story } = this.props;
    storyService.update(story._id, { startSeq: seq._id });
    // This does trigger the render function a second time (after the
    // update or addition of a new sequence) but it shouldn't affect
    // performance as there are not many things rendered and this
    // method should not be called often.
    storyViewStore.updateCurrentStory(
      { startSeq: seq._id }
    );
  };

  onSaveSequence = async (sequence, isStartSeq) => {
    if (!sequence._id) {
      socket.emit(
        SocketEvents.NewSequenceRequest,
        SequenceModel.forApi(sequence, ['story', 'x', 'y']),
      );
    } else {
      const { story } = this.props;

      if (isStartSeq && (!story.startSeq || story.startSeq !== sequence._id)) {
        await this.updateStoryStartSeq(sequence);
      }

      socket.emit(
        SocketEvents.UpdateSequenceRequest,
        {
          _id: sequence._id,
          ...SequenceModel.forApi(sequence),
        },
      );
    }
  };

  onSaveOptions = (options) => {
    console.log(options);
    // TODO: save on BE
  };

  onUpdateSeqPosition = (seqId, x, y) => {
    socket.emit(
      SocketEvents.UpdateSequenceRequest,
      { _id: seqId, x, y },
    );
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
        onSaveSequence={this.onSaveSequence}
        onSaveOptions={this.onSaveOptions}
        onUpdateSeqPosition={this.onUpdateSeqPosition}
      />
    );
  }
}

WriteStoryContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default WriteStoryContainer;
