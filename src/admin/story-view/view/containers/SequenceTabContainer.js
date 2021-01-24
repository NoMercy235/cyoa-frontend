import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { StoryModel } from '../../../../infrastructure/models/StoryModel';
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
  tableRef = React.createRef();

  getSelectedChapterId = () => {
    const {
      queryParams: {
        sequences: {
          filters: {
            chapter: {
              value: selectedChapterId,
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
      chapterId = selectedChapterId;
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
    const { story, appStore } = this.props;

    const params = { ':story': story._id };
    sequenceService.setNextRouteParams(params);
    await sequenceService.delete(sequenceId);
    appStore.showSuccessSnackbar({
      message: 'Sequence deleted!',
    });
    await this.getSequences();
  };

  onEditOption = async (sequenceId, optionId) => {
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);

    const option = await optionService.get(optionId);
    option.nextSeq = option.nextSeq
      ? {
        value: option.nextSeq._id,
        label: option.nextSeq.name,
      }
      : undefined;
    return option;
  };

  onDeleteOption = async (sequenceId, optionId) => {
    const { storyViewStore, appStore } = this.props;
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);
    await optionService.delete(optionId);
    storyViewStore.removeOptionFromSequence(sequenceId, optionId);
    appStore.showSuccessSnackbar({
      message: 'Option deleted!',
    });
  };

  onUpdateSequence = async (sequence, ahead) => {
    const { story, appStore } = this.props;
    const params = { ':story': story._id };
    sequenceService.setNextRouteParams(params);
    await sequenceService.updateOrder(sequence, ahead);
    await this.getSequences();
    appStore.showSuccessSnackbar({
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
    const { appStore } = this.props;
    await chapterService.delete(chapterId);
    appStore.showSuccessSnackbar({
      message: 'Chapter deleted!',
    });

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
