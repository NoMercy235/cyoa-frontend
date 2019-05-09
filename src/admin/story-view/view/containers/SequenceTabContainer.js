import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';
import { inject, observer } from 'mobx-react';
import SequenceTableCmp from '../components/sequences/sequence-table/SequenceTableCmp';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import { sequenceService } from '../../../../infrastructure/services/SequenceService';
import { optionService } from '../../../../infrastructure/services/OptionService';
import ChapterListCmp from '../components/sequences/chapter-table/ChapterListCmp';
import classes from './SequenceTabContainer.module.scss';
import { chapterService } from '../../../../infrastructure/services/ChapterService';
import { withRouter } from 'react-router-dom';

@inject('storyViewStore')
@observer
class SequenceTabContainer extends Component {
  state = {
    selectedChapterId: '',
  };
  snackbarRef = React.createRef();

  getSequences = async (chapterId = '') => {
    const params = { ':story': this.props.match.params.id };
    sequenceService.setNextRouteParams(params);

    let filters = {};

    this.setState({ selectedChapterId: chapterId });
    filters.chapter = {
      op: 'equals',
      value: chapterId,
      options: {
        allowEmpty: true,
      },
    };

    const sequences = await sequenceService.list(
      filters,
      { order: 'asc' },
    );
    this.props.storyViewStore.setSequences(sequences);
  };

  onDeleteSequence = async sequenceId => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    await this.snackbarRef.current.executeAndShowSnackbar(
      sequenceService.delete.bind(null, sequenceId),
      { variant: 'success', message: 'Sequence deleted!' },
    );
    this.props.storyViewStore.removeSequence(sequenceId);
  };

  onDeleteOption = async (sequenceId, optionId) => {
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);
    await this.snackbarRef.current.executeAndShowSnackbar(
      optionService.delete.bind(null, optionId),
      { variant: 'success', message: 'Option deleted!' },
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
    this.snackbarRef.current.showSnackbar({
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
    const { storyViewStore } = this.props;
    const chapters = await chapterService.list();
    storyViewStore.setChapters(chapters);
  };

  onDeleteChapter = async (chapterId) => {
    await chapterService.delete(chapterId);
    await this.getChapters();
    this.snackbarRef.current.showSnackbar({
      variant: 'success',
      message: 'Chapter deleted!',
    });
  };

  componentDidMount () {
    const { story } = this.props;
    const params = { ':story': story._id };
    chapterService.setNextRouteParams(params);
    this.getSequences();
    this.getChapters();
  }

  render() {
    const { storyViewStore: { sequencesInOrder, chapters }, story } = this.props;
    const { selectedChapterId } = this.state;

    return (
      <>
        <div className={classes.tablesContainer}>
          <ChapterListCmp
            className={classes.chaptersList}
            chapters={chapters}
            selectedChapterId={selectedChapterId}
            onDeleteChapter={this.onDeleteChapter}
            onChapterClick={this.getSequences}
          />
          <SequenceTableCmp
            className={classes.sequencesTable}
            story={story}
            sequences={sequencesInOrder}
            selectedChapterId={selectedChapterId}
            onDeleteSequence={this.onDeleteSequence}
            onDeleteOption={this.onDeleteOption}
            onMoveSeqUp={this.onMoveSeqUp}
            onMoveSeqDown={this.onMoveSeqDown}
          />
        </div>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

SequenceTabContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,

  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default withRouter(SequenceTabContainer);
