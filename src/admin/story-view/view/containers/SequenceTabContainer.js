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
import ChapterListCmp from '../components/sequences/chapter-table/ChapterListCmp';
import classes from './SequenceTabContainer.module.scss';
import { chapterService } from '../../../../infrastructure/services/ChapterService';

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

  /**
   * How the move logic works:
   * Get the pivot (current) sequence and modify it's order accordingly.
   * Get the sequence that is before/after the pivot, depending on the button prossed
   * Update their order property accordingly
   * Call the API which handles this update in a specific way
   * Modify in place the elements in the array from the store
   */
  onUpdateSequence = async sequences => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    const dbSequences = await sequenceService.updateOrder(sequences);
    await Promise.all(dbSequences.map(dbSeq => {
      return this.props.storyViewStore.updateSequenceInPlace(dbSeq._id, { order: dbSeq.order });
    }));
    this.setState({
      open: true,
      variant: 'success',
      message: 'Order has been updated',
    });
  };

  onMoveSeqUp = seq => {
    const { sequencesInOrder } = this.props.storyViewStore;
    const index = sequencesInOrder.findIndex(s => s._id === seq._id);
    let sequences = [{ _id: seq._id, order: seq.order - 1 }];
    if (index > 0) {
      const beforeSeq = sequencesInOrder[index - 1];
      sequences.push({ _id: beforeSeq._id, order: seq.order });
    }
    this.onUpdateSequence(sequences);
  };

  onMoveSeqDown = seq => {
    const { sequencesInOrder } = this.props.storyViewStore;
    const index = sequencesInOrder.findIndex(s => s._id === seq._id);
    let sequences = [{ _id: seq._id, order: seq.order + 1 }];
    if (index < sequencesInOrder.length - 1) {
      const afterSeq = sequencesInOrder[index + 1];
      sequences.push({ _id: afterSeq._id, order: seq.order });
    }
    this.onUpdateSequence(sequences);
  };
  // End of the moving logic

  getChapters = async () => {
    const chapters = await chapterService.list();
    this.props.storyViewStore.setChapters(chapters);
  };

  onDeleteChapter = async (chapterId) => {
    await chapterService.delete(chapterId);
    await this.getChapters();
    this.setState({
      open: true,
      variant: 'success',
      message: 'Chapter deleted',
    });
  };

  componentDidMount () {
    this.props.getSequences();
    this.getChapters();
  }

  render() {
    const { storyViewStore: { sequencesInOrder, chapters }, story } = this.props;
    const { open, message, variant } = this.state;

    return (
      <Fragment>
        <div className={classes.tablesContainer}>
          <ChapterListCmp
            className={classes.chaptersList}
            chapters={chapters}
            onDeleteChapter={this.onDeleteChapter}
          />
          <SequenceTableCmp
            className={classes.sequencesTable}
            story={story}
            sequences={sequencesInOrder}
            onDeleteSequence={this.onDeleteSequence}
            onDeleteOption={this.onDeleteOption}
            onMoveSeqUp={this.onMoveSeqUp}
            onMoveSeqDown={this.onMoveSeqDown}
          />
        </div>
        <Snackbar
          open={open}
          onClose={this.onChangeState({ open: false })}
          message={message}
          variant={variant}
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
