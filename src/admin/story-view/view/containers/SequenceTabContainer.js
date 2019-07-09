import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import Snackbar, { SnackbarEnum } from '../../../../shared/components/snackbar/Snackbar';
import SequenceTableCmp from '../components/sequences/sequence-table/SequenceTableCmp';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import { sequenceService } from '../../../../infrastructure/services/SequenceService';
import { optionService } from '../../../../infrastructure/services/OptionService';
import ChapterListCmp from '../components/sequences/chapter-table/ChapterListCmp';
import { chapterService } from '../../../../infrastructure/services/ChapterService';

import classes from './SequenceTabContainer.module.scss';

@inject('storyViewStore')
@observer
class SequenceTabContainer extends Component {
  state = {
    selectedChapterId: '',
  };
  snackbarRef = React.createRef();

  getSequences = async (chapterId = '') => {
    const { storyViewStore, match } = this.props;

    const params = { ':story': match.params.id };
    sequenceService.setNextRouteParams(params);

    storyViewStore.queryParams.sequences.addFilter(
      { name: 'chapter', op: 'equals', value: chapterId },
      { allowEmpty: true }
    );
    this.setState({ selectedChapterId: chapterId });
    await storyViewStore.serviceGetSequences();
  };

  onDeleteSequence = async sequenceId => {
    const { story, storyViewStore } = this.props;

    const params = { ':story': story._id };
    sequenceService.setNextRouteParams(params);
    await this.snackbarRef.current.executeAndShowSnackbar(
      sequenceService.delete,
      [sequenceId],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Sequence deleted!',
      },
    );
    await storyViewStore.serviceGetSequences();
  };

  onEditOption = async (sequenceId, optionId) => {
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);

    const option = await optionService.get(optionId);
    option.nextSeq = {
      value: option.nextSeq._id,
      label: option.nextSeq.name,
    };
    return option;
  };

  onDeleteOption = async (sequenceId, optionId) => {
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);
    await this.snackbarRef.current.executeAndShowSnackbar(
      optionService.delete,
      [optionId],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Option deleted!',
      },
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
    await sequenceService.updateOrder(sequences);
    await this.props.storyViewStore.serviceGetSequences();
    this.snackbarRef.current.showSnackbar({
      variant: SnackbarEnum.Variants.Success,
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
    const { selectedChapterId } = this.state;

    await this.snackbarRef.current.executeAndShowSnackbar(
      chapterService.delete,
      [chapterId],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Chapter deleted!',
      },
    );

    await Promise.all([
      this.getChapters(),
      (chapterId === selectedChapterId) && this.getSequences(),
    ]);
  };

  onChangeSequencesPage = async currentPage => {
    const { storyViewStore: { queryParams } } = this.props;

    queryParams.sequences.setPagination({ page: currentPage });
    await this.getSequences(this.state.selectedChapterId);
  };

  componentDidMount () {
    const { story, storyViewStore } = this.props;
    const params = { ':story': story._id };
    chapterService.setNextRouteParams(params);

    // Set the default sort. This can't be changed from the UI yet.
    storyViewStore.queryParams.sequences.setSort({
      field: 'order', order: 'asc',
    });

    this.getSequences();
    this.getChapters();
  }

  componentWillUnmount () {
    const { storyViewStore } = this.props;

    storyViewStore.queryParams.sequences.reset();
    storyViewStore.setSequences([]);
    storyViewStore.setChapters([]);
  }

  render() {
    const {
      story,
      storyViewStore: { sequencesInOrder, chapters, queryParams },
    } = this.props;
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
            queryParams={queryParams.sequences}
            selectedChapterId={selectedChapterId}
            onDeleteSequence={this.onDeleteSequence}
            onEditOption={this.onEditOption}
            onDeleteOption={this.onDeleteOption}
            onMoveSeqUp={this.onMoveSeqUp}
            onMoveSeqDown={this.onMoveSeqDown}
            onChangePage={this.onChangeSequencesPage}
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
