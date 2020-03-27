import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
import { attributeService } from '../../../../infrastructure/services/AttributeService';
import { OptionModel } from '../../../../infrastructure/models/OptionModel';
import ConfirmationModal from '../../../../shared/components/confirmation/ConfirmationModal';

@inject('storyViewStore')
@observer
class WriteStoryContainer extends Component {
  state = {
    canRender: false,
    isDeleteSequenceModalOpen: false,
    resourceToDelete: undefined,
  };

  async componentDidMount () {
    await Promise.all([
      this.getSequences(),
      this.getOptions(),
      this.getAttributes(),
    ]);
    this.setState({ canRender: true });
    this.setupSocketResponses();
  }
  setupSocketResponses = () => {
    const { storyViewStore } = this.props;
    socket.on(SocketEvents.NewSequenceResponse, seq => {
      storyViewStore.addSequence(new SequenceModel(seq));
    });
    socket.on(SocketEvents.UpdateSequenceResponse, seq => {
      storyViewStore.updateSequenceInPlace(seq._id, seq);
    });
    socket.on(SocketEvents.DeleteSequenceResponse, seq => {
      storyViewStore.removeSequenceWithRelatedOptions(seq._id);
    });
    socket.on(SocketEvents.SaveOptionsResponse, result => {
      const { created, updated } = result;
      storyViewStore.addToAllStoryOptions(created.map(option => new OptionModel(option)));
      storyViewStore.updateInAllStoryOptions(updated.map(option => new OptionModel(option)));
    });
    socket.on(SocketEvents.DeleteOptionsResponse, optionIds => {
      storyViewStore.removeAllStoryOptions(optionIds);
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

  getAttributes = async () => {
    const { story, storyViewStore } = this.props;
    const params = { ':story': story._id };
    attributeService.setNextRouteParams(params);
    const attributes = await attributeService.list();
    storyViewStore.setAttributes(attributes);
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

  onDeleteSequence = () => {
    const { resourceToDelete: sequence } = this.state;
    socket.emit(
      SocketEvents.DeleteSequenceRequest,
      sequence._id,
    );
    this.onCloseDeleteModals();
  };

  onDeleteSequenceModalOpen = (seqId) => {
    const {
      storyViewStore,
    } = this.props;

    const sequence = storyViewStore.getSequenceById(seqId);
    this.setState({
      isDeleteSequenceModalOpen: true,
      resourceToDelete: sequence,
    });
  };

  onCloseDeleteModals = () => {
    this.setState({
      isDeleteSequenceModalOpen: false,
      isDeleteOptionsModalOpen: false,
      resourceToDelete: undefined,
    });
  };

  onSaveOptions = (newOptions, optionsToDelete) => {
    socket.emit(
      SocketEvents.SaveOptionsRequest,
      newOptions.map(option => OptionModel.forApi(option, ['_id'])),
    );
    socket.emit(
      SocketEvents.DeleteOptionsRequest,
      optionsToDelete.map(option => option._id),
    );
  };

  onUpdateSeqPosition = (seqId, x, y) => {
    socket.emit(
      SocketEvents.UpdateSequenceRequest,
      { _id: seqId, x, y },
    );
  };

  renderDeleteSequenceModalContent = (sequence = {}) => {
    return (
      <>
        <Typography>You are about to delete the following sequence:</Typography>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <b>{sequence.name}</b>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <span>{sequence.content}</span>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </>
    );
  };

  renderDeleteSequenceModal = () => {
    const {
      isDeleteSequenceModalOpen,
      resourceToDelete,
    } = this.state;
    return (
      <ConfirmationModal
        title="Delete sequence?"
        description={this.renderDeleteSequenceModalContent(resourceToDelete)}
        open={isDeleteSequenceModalOpen}
        onAccept={this.onDeleteSequence}
        onClose={this.onCloseDeleteModals}
      />
    );
  };

  render() {
    const {
      storyViewStore: {
        currentStory,
        sequences,
        allStoryOptions,
        attributes,
      },
    } = this.props;
    const { canRender } = this.state;

    if (!canRender) {
      return <LoadingCmp/>
    }

    return (
      <>
        <WriteStoryComponent
          story={currentStory}
          sequences={sequences}
          options={allStoryOptions}
          attributes={attributes}
          onSaveSequence={this.onSaveSequence}
          onDeleteSequenceModalOpen={this.onDeleteSequenceModalOpen}
          onSaveOptions={this.onSaveOptions}
          onUpdateSeqPosition={this.onUpdateSeqPosition}
        />
        {this.renderDeleteSequenceModal()}
      </>
    );
  }
}

WriteStoryContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default WriteStoryContainer;
