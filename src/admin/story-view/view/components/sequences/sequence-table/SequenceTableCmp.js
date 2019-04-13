import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../../shared/components/table/TableCmp.css';
import { styles as customStyles } from './SequenceTableCmp.css';
import TableCmp from '../../../../../../shared/components/table/TableCmp';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import BasicEditAction from '../../../../../../shared/components/form/BasicEditAction';
import SaveSequenceModal from '../save-sequence/SaveSequenceModal';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import OptionTableCmp from '../option-table/OptionTableCmp';
import { observer } from 'mobx-react';
import { renderSequenceTableTitle } from './SequenceTableTitle';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import BasicReorderAction from '../../../../../../shared/components/form/BasicReorderAction';
import YesIcon from '@material-ui/icons/Check';
import { parseContent } from '../../../../../../shared/utilities';
import { chapterService } from '../../../../../../infrastructure/services/ChapterService';

@observer
class SequenceTableCmp extends Component {
  state = {
    chapters: [],
    canReorder: true,
  };

  onDeleteSequence = id => () => {
    this.props.onDeleteSequence(id);
  };

  onMoveSeqUp = (seq) => () => {
    this.props.onMoveSeqUp(seq);
  };

  onMoveSeqDown = (seq) => () => {
    this.props.onMoveSeqDown(seq);
  };

  getActions = (row, index) => {
    const { classes, sequences, story, selectedChapterId } = this.props;
    const { chapters, canReorder } = this.state;

    return (
      <div key={row._id} className={classes.actionsContainer}>
        {canReorder && <BasicReorderAction
          onMoveUp={this.onMoveSeqUp(row)}
          onMoveDown={this.onMoveSeqDown(row)}
          disableUp={index === 0}
          disableDown={index === sequences.length - 1}
        />}
        <BasicEditAction
          resourceName="sequence"
          resource={row}
          modalComponent={SaveSequenceModal}
          onModalOpen={this.getAllChapters}
          innerProps={{ story, chapters, selectedChapterId, isStartSeq: this.isStartSeq(row) }}
        />
        <DeleteRow
          title="Delete confirmation"
          description="Are you sure you want to delete this sequence?"
          onClick={this.onDeleteSequence(row._id)}
        />
      </div>
    );
  };

  renderOptionsTable = (rowData) => {
    const { classes, onDeleteOption, sequences } = this.props;
    const colSpan = SequenceModel.getTableColumns().length;
    const rowSeqId = rowData[0];

    const sequence = sequences.find(s => s._id === rowSeqId);

    return (
      <tr>
        <td colSpan={colSpan} className={classes.optionsTableContainer}>
          {parseContent(sequence.content)}
          {!sequence.isEnding && <OptionTableCmp
            sequenceId={rowSeqId}
            onDeleteOption={onDeleteOption}
          />}
        </td>
      </tr>
    );
  };

  isStartSeq = seq => this.props.story.startSeq === seq._id;

  renderIsStartSequence = seq => {
    return this.isStartSeq(seq) ? <YesIcon color="primary"/> : null;
  };

  renderIsEndingSequence = seq => {
    return seq.isEnding ? <YesIcon color="primary"/> : null;
  };

  getAllChapters = async () => {
    const chapters = await chapterService.list({});
    this.setState({ chapters });
  };

  render() {
    const { sequences, story, selectedChapterId, className } = this.props;
    const { chapters } = this.state;
    const columns = SequenceModel.getTableColumns();

    const data = sequences.map((s, i) => {
      return [
        s._id,
        s.authorNote,
        this.renderIsStartSequence(s),
        this.renderIsEndingSequence(s),
        this.getActions(s, i)];
    });

    const options = {
      expandableRows: true,
      renderExpandableRow: this.renderOptionsTable,
      onTableChange: (action, tableState) => {
        if (action !== 'expandRow') return;
        if (tableState.expandedRows.data.length && this.state.canReorder) {
          this.setState({ canReorder: false });
        } else if (!tableState.expandedRows.data.length && !this.state.canReorder) {
          this.setState({ canReorder: true });
        }
      },
      customToolbar: () => {
        return (
          <BasicNewAction
            tooltip="New sequence"
            modalComponent={SaveSequenceModal}
            innerProps={{ story, chapters, selectedChapterId, isStartSeq: false }}
            onModalOpen={this.getAllChapters}
          />
        );
      },
    };

    return (
      <TableCmp
        className={className}
        title={renderSequenceTableTitle()}
        columns={columns}
        data={data}
        options={options}
      />
    );
  }
}

SequenceTableCmp.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  story: PropTypes.instanceOf(StoryModel),
  sequences: PropTypes.arrayOf(PropTypes.instanceOf(SequenceModel)),
  selectedChapterId: PropTypes.string.isRequired,
  onDeleteSequence: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  onMoveSeqUp: PropTypes.func.isRequired,
  onMoveSeqDown: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...customStyles(theme),
}))(SequenceTableCmp);
