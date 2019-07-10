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
import { appStorePropTypes } from '../../../../shared/store/AppStore';

import classes from './SequenceTabContainer.module.scss';

@inject('storyViewStore', 'appStore')
@observer
class SequenceTabContainer extends Component {
  snackbarRef = React.createRef();

  getSelectedChapterId = () => {
    const {
      queryParams: {
        sequences: {
          filters: {
            chapter: {
              value: selectedChapterId
            } = {},
          },
        },
      },
    } = this.props.appStore;
    return selectedChapterId || '';
  };

  getSequences = async chapterId => {
    const { appStore, storyViewStore, match } = this.props;
    const selectedChapterId = this.getSelectedChapterId();

    if (chapterId === undefined) {
      chapterId = selectedChapterId
    }

    const params = { ':story': match.params.id };
    sequenceService.setNextRouteParams(params);

    appStore.queryParams.sequences.addFilter(
      { name: 'chapter', op: 'equals', value: chapterId },
      { allowEmpty: true }
    );
    const { sequences, page, total } = await sequenceService.list(appStore.queryParams.sequences);
    appStore.queryParams.sequences.setPagination({ page, total });
    storyViewStore.setSequences(sequences);
  };

  onDeleteSequence = async sequenceId => {
    const { story } = this.props;

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
    await this.getSequences();
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
    await this.getSequences();
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

  onChangeChapter = async chapterId => {
    const { appStore: { queryParams } } = this.props;

    queryParams.sequences.refreshPage();
    await this.getSequences(chapterId);
  };

  getChapters = async () => {
    const { storyViewStore } = this.props;
    const chapters = await chapterService.list();
    storyViewStore.setChapters(chapters);
  };

  onDeleteChapter = async (chapterId) => {
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
      (chapterId === this.getSelectedChapterId()) && this.getSequences(),
    ]);
  };

  onChangeSequencesPage = async currentPage => {
    const { appStore: { queryParams } } = this.props;

    queryParams.sequences.setPagination({ page: currentPage });
    await this.getSequences(this.getSelectedChapterId());
  };

  componentDidMount () {
    const { appStore, story } = this.props;
    const params = { ':story': story._id };
    chapterService.setNextRouteParams(params);

    // Set the default sort. This can't be changed from the UI yet.
    appStore.queryParams.sequences.setSort({
      field: 'order', order: 'asc',
    });

    this.getSequences();
    this.getChapters();
  }

  componentWillUnmount () {
    const { appStore, storyViewStore } = this.props;

    appStore.queryParams.sequences.reset();
    storyViewStore.setSequences([]);
    storyViewStore.setChapters([]);
  }

  render() {
    const {
      appStore: { queryParams },
      story,
      storyViewStore: { sequencesInOrder, chapters },
    } = this.props;
    const selectedChapterId = this.getSelectedChapterId();

    return (
      <>
        <div className={classes.tablesContainer}>
          <ChapterListCmp
            className={classes.chaptersList}
            chapters={chapters}
            selectedChapterId={selectedChapterId}
            onDeleteChapter={this.onDeleteChapter}
            onChapterClick={this.onChangeChapter}
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
            onSequenceSave={this.getSequences}
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
  appStore: appStorePropTypes,
};

export default withRouter(SequenceTabContainer);
