import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';
import { inject, observer } from 'mobx-react';
import SequenceTableCmp from '../components/sequences/sequence-table/SequenceTableCmp';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import { sequenceService } from '../../../../infrastructure/services/SequenceService';
import { withSnackbar } from '../../../../shared/components/form/helpers';
import { optionService } from '../../../../infrastructure/services/OptionService';

@inject('storyViewStore')
@observer
class SequenceTabContainer extends Component {
  state = {
    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  onDeleteSequence = async sequenceId => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    await withSnackbar.call(
      this,
      sequenceService.delete,
      [sequenceId],
      'Sequence deleted'
    );
    this.props.storyViewStore.removeSequence(sequenceId);
  };

  onDeleteOption = async (sequenceId, optionId) => {
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);
    await withSnackbar.call(
      this,
      optionService.delete,
      [optionId],
      'Option deleted'
    );
    this.props.storyViewStore.removeOptionFromSequence(sequenceId, optionId);
  };

  onUpdateSequence = async (seqId, metadata) => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    const sequence = await withSnackbar.call(
      this,
      sequenceService.update,
      [seqId, metadata],
      'Order changed!',
    );
    this.props.storyViewStore.updateSequenceInPlace(seqId, { order: sequence.order });
    return sequence;
  };

  onMoveSeqUp = seq => {
    const { sequencesInOrder } = this.props.storyViewStore;
    const index = sequencesInOrder.findIndex(s => s._id === seq._id);
    if (index > 0) {
      const beforeSeq = sequencesInOrder[index - 1];
      this.onUpdateSequence(beforeSeq._id, { order: seq.order });
    }
    this.onUpdateSequence(seq._id, { order: seq.order - 1 });
  };

  onMoveSeqDown = seq => {
    const { sequencesInOrder } = this.props.storyViewStore;
    const index = sequencesInOrder.findIndex(s => s._id === seq._id);
    if (index < sequencesInOrder.length - 1) {
      const afterSeq = sequencesInOrder[index + 1];
      this.onUpdateSequence(afterSeq._id, { order: seq.order });
    }
    this.onUpdateSequence(seq._id, { order: seq.order + 1 });
  };

  componentDidMount () {
    this.props.getSequences();
  }

  render() {
    const { storyViewStore: { sequencesInOrder }, story } = this.props;

    return (
      <Fragment>
        <SequenceTableCmp
          story={story}
          sequences={sequencesInOrder}
          onDeleteSequence={this.onDeleteSequence}
          onDeleteOption={this.onDeleteOption}
          onMoveSeqUp={this.onMoveSeqUp}
          onMoveSeqDown={this.onMoveSeqDown}
        />
        <Snackbar
          open={this.state.open}
          onClose={this.onChangeState({ open: false })}
          message={this.state.message}
          variant={this.state.variant}
        />
      </Fragment>
    );
  }
}

SequenceTabContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
  getSequences: PropTypes.func.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default SequenceTabContainer;
