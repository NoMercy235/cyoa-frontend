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
import { SEQUENCES_ADMIN_TABLE } from '../../../../shared/constants/tables';

import classes from './SequenceTabContainer.module.scss';

@inject('storyViewStore', 'appStore')
@observer
class SequenceTabContainer extends Component {
  snackbarRef = React.createRef();
  tableRef = React.createRef();

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
    const {
      appStore: {
        queryParams,
        addCurrentLoadingAnimation,
        removeCurrentLoadingAnimation,
      },
      storyViewStore,
      match,
    } = this.props;
    const selectedChapterId = this.getSelectedChapterId();

    addCurrentLoadingAnimation(SEQUENCES_ADMIN_TABLE);

    if (chapterId === undefined) {
      chapterId = selectedChapterId
    }

    const params = { ':story': match.params.id };
    sequenceService.setNextRouteParams(params);

    queryParams.sequences.addFilter(
      { name: 'chapter', op: 'equals', value: chapterId },
      { allowEmpty: true }
    );
    const { sequences, page, total } = await sequenceService.list(queryParams.sequences);
    queryParams.sequences.setPagination({ page, total });
    storyViewStore.setSequences(sequences);
    removeCurrentLoadingAnimation(SEQUENCES_ADMIN_TABLE);
  };

  onDeleteSequence = async sequenceId => {
    const { story } = this.props;

    const params = { ':story': story.id };
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
      value: option.nextSeq.id,
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

  onUpdateSequence = async (sequence, ahead) => {
    const params = { ':story': this.props.story.id };
    sequenceService.setNextRouteParams(params);
    await sequenceService.updateOrder(sequence, ahead);
    await this.getSequences();
    this.snackbarRef.current.showSnackbar({
      variant: SnackbarEnum.Variants.Success,
      message: 'Order has been updated',
    });
  };

  onMoveSeqUp = seq => {
     this.onUpdateSequence(seq, false);
  };

  onMoveSeqDown = seq => {
      this.onUpdateSequence(seq, true);
  };

  onChangeChapter = async chapterId => {
    const { appStore: { queryParams } } = this.props;

    queryParams.sequences.refreshPage();
    // TODO: this is a hack because we can't change the page from the outside
    // @see https://github.com/gregnb/mui-datatables/issues/756
    this.tableRef.current.changePage(0);
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
    const {
      appStore: {
        queryParams,
        addCurrentLoadingAnimation,
        removeCurrentLoadingAnimation,
      },
    } = this.props;

    queryParams.sequences.setPagination({ page: currentPage });
    addCurrentLoadingAnimation(SEQUENCES_ADMIN_TABLE);
    await this.getSequences(this.getSelectedChapterId());
    removeCurrentLoadingAnimation(SEQUENCES_ADMIN_TABLE);
  };

  componentDidMount () {
    const { appStore, story } = this.props;
    const params = { ':story': story.id };
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
            tableRef={this.tableRef}
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
