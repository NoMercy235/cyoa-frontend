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
import { attributeService } from '../../../../infrastructure/services/AttributeService';
import { OptionModel } from '../../../../infrastructure/models/OptionModel';
import ConfirmationModal from '../../../../shared/components/confirmation/ConfirmationModal';

@inject('storyViewStore')
@observer
class WriteStoryContainer extends Component {
  state = {
    canRender: false,
    isDeleteSequenceModalOpen: false,
    isDeleteOptionsModalOpen: false,
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
    socket.on(SocketEvents.NewSequenceResponse, ({ sequence, story }) => {
      storyViewStore.addSequence(new SequenceModel(sequence));
      story && storyViewStore.updateCurrentStory(
        { startSeq: story.startSeq }
      );
    });
    socket.on(SocketEvents.UpdateSequenceResponse, ({ sequence, story }) => {
      storyViewStore.updateSequenceInPlace(sequence._id, sequence);
      story && storyViewStore.updateCurrentStory(
        { startSeq: story.startSeq }
      );
    });
    socket.on(SocketEvents.DeleteSequenceResponse, ({ sequence, story }) => {
      storyViewStore.removeSequenceWithRelatedOptions(sequence._id);
      story && storyViewStore.updateCurrentStory(
        { startSeq: story.startSeq }
      );
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

  onSaveSequence = async (sequence, isStartSeq) => {
    if (!sequence._id) {
      socket.emit(
        SocketEvents.NewSequenceRequest,
        {
          sequence: SequenceModel.forApi(sequence, ['story', 'x', 'y']),
          isStartSeq,
        },
      );
    } else {
      socket.emit(
        SocketEvents.UpdateSequenceRequest,
        {
          sequence: SequenceModel.forApi(sequence, ['_id']),
          isStartSeq,
        },
      );
    }
  };

  onDeleteSequence = () => {
    const { story } = this.props;
    const { resourceToDelete: sequence } = this.state;
    socket.emit(
      SocketEvents.DeleteSequenceRequest,
      { storyId: story._id, sequenceId: sequence._id },
    );
    this.onCloseDeleteModals();
  };

  onDeleteOptionsBetweenSequences = () => {
    const { resourceToDelete: { options } } = this.state;
    this.onSaveOptions([], options);
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

  onOpenDeleteOptionsModal = (fromSeqId, toSeqId, options) => {
    const { storyViewStore } = this.props;

    const fromSeq = storyViewStore.getSequenceById(fromSeqId);
    const toSeq = storyViewStore.getSequenceById(toSeqId);
    this.setState({
      isDeleteOptionsModalOpen: true,
      resourceToDelete: {
        fromSeq,
        toSeq,
        options,
      },
    });
  };

  onCloseDeleteModals = () => {
    this.setState({
      isDeleteSequenceModalOpen: false,
      isDeleteOptionsModalOpen: false,
      resourceToDelete: undefined,
    });
  };

  onSaveOptions = (newOptions = [], optionsToDelete = []) => {
    newOptions.length && socket.emit(
      SocketEvents.SaveOptionsRequest,
      newOptions.map(option => OptionModel.forApi(option, ['_id'])),
    );
    optionsToDelete.length && socket.emit(
      SocketEvents.DeleteOptionsRequest,
      optionsToDelete.map(option => option._id),
    );
  };

  onUpdateSeqPosition = (seqId, x, y) => {
    socket.emit(
      SocketEvents.UpdateSequenceRequest,
      { sequence: { _id: seqId, x, y } },
    );
  };

  renderDeleteSequenceModalContent = () => {
    const { resourceToDelete: sequence = {} } = this.state;
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
    const { isDeleteSequenceModalOpen } = this.state;
    return (
      <ConfirmationModal
        title="Delete sequence?"
        description={this.renderDeleteSequenceModalContent()}
        open={isDeleteSequenceModalOpen}
        onAccept={this.onDeleteSequence}
        onClose={this.onCloseDeleteModals}
      />
    );
  };

  renderDeleteOptionsModal = () => {
    const { isDeleteOptionsModalOpen } = this.state;
    return (
      <ConfirmationModal
        title="Delete options?"
        description={<Typography>You are about to delete all options between these sequences</Typography>}
        open={isDeleteOptionsModalOpen}
        onAccept={this.onDeleteOptionsBetweenSequences}
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
          onOpenDeleteOptionsModal={this.onOpenDeleteOptionsModal}
          onSaveOptions={this.onSaveOptions}
          onUpdateSeqPosition={this.onUpdateSeqPosition}
        />
        {this.renderDeleteSequenceModal()}
        {this.renderDeleteOptionsModal()}
      </>
    );
  }
}

WriteStoryContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default WriteStoryContainer;
