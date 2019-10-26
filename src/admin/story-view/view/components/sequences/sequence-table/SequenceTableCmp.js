import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Tooltip } from '@material-ui/core';
import { observer } from 'mobx-react';
import ForwardIcon from '@material-ui/icons/Forward';
import FlagIcon from '@material-ui/icons/Flag';

import TableCmp from '../../../../../../shared/components/table/TableCmp';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import BasicEditAction from '../../../../../../shared/components/form/BasicEditAction';
import SaveSequenceModal from '../save-sequence/SaveSequenceModal';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import OptionTableCmp from '../option-table/OptionTableCmp';
import { renderSequenceTableTitle } from './SequenceTableTitle';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import BasicReorderAction from '../../../../../../shared/components/form/BasicReorderAction';
import { parseContent } from '../../../../../../shared/utilities';
import withDisabledStoryPublished from '../../../../../../shared/hoc/withDisabledStoryPublished';
import { SEQUENCES_ADMIN_TABLE } from '../../../../../../shared/constants/tables';

import { styles as tableStyles } from '../../../../../../shared/components/table/TableCmp.css';
import { styles as customStyles } from './SequenceTableCmp.css';

const BasicNewBtnWithDisabledState = withDisabledStoryPublished(BasicNewAction);
const BasicEditBtnWithDisabledState = withDisabledStoryPublished(BasicEditAction);
const BasicDeleteBtnWithDisabledState = withDisabledStoryPublished(DeleteRow);

@observer
class SequenceTableCmp extends Component {
  state = {
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

  getActions = row => {
    const {
      classes,
      queryParams,
      story,
      selectedChapterId,
      onSequenceSave,
    } = this.props;
    const { canReorder } = this.state;

    return (
      <div key={row._id} className={classes.actionsContainer}>
        {canReorder && <BasicReorderAction
          onMoveUp={this.onMoveSeqUp(row)}
          onMoveDown={this.onMoveSeqDown(row)}
          disableUp={row.order === 0}
          disableDown={row.order === queryParams.pagination.total - 1}
        />}
        <BasicEditBtnWithDisabledState
          resourceName="sequence"
          resource={row}
          modalComponent={SaveSequenceModal}
          innerProps={{
            story,
            selectedChapterId,
            onSuccess: onSequenceSave,
            isStartSeq: this.isStartSeq(row)
          }}
        />
        <BasicDeleteBtnWithDisabledState
          title="Delete confirmation"
          description="Are you sure you want to delete this sequence?"
          onClick={this.onDeleteSequence(row._id)}
        />
      </div>
    );
  };

  renderOptionsTable = (rowData) => {
    const {
      classes,
      sequences,
      onEditOption,
      onDeleteOption,
    } = this.props;
    const colSpan = SequenceModel.getTableColumns().length;
    const rowSeqId = rowData[0];

    const sequence = sequences.find(s => s._id === rowSeqId);

    return sequence && (
      <tr>
        <td colSpan={colSpan} className={classes.optionsTableContainer}>
          {parseContent(sequence.content)}
          {!sequence.isEnding && (
            <OptionTableCmp
              sequence={sequence}
              onEditOption={onEditOption}
              onDeleteOption={onDeleteOption}
            />
          )}
        </td>
      </tr>
    );
  };

  isStartSeq = seq => this.props.story.startSeq === seq._id;

  renderType = seq => {
    if (this.isStartSeq(seq)) {
      return (
        <Tooltip title="Starting sequence">
          <ForwardIcon color="primary"/>
        </Tooltip>
      );
    } else if (seq.isEnding) {
      return (
        <Tooltip title="Ending sequence">
          <FlagIcon color="secondary"/>
        </Tooltip>
      );
    } else {
      return null;
    }
  };

  render() {
    const {
      tableRef,
      className,
      sequences,
      queryParams,
      story,
      selectedChapterId,
      onChangePage,
      onSequenceSave,
    } = this.props;
    const columns = SequenceModel.getTableColumns();

    const data = sequences.map((s, i) => {
      return [
        s._id,
        s.name,
        this.renderType(s),
        this.getActions(s, i)];
    });

    const options = {
      expandableRows: true,
      renderExpandableRow: this.renderOptionsTable,
      pagination: true,
      page: queryParams.pagination.page,
      count: queryParams.pagination.total,
      rowsPerPageOptions: [5, 10, 15],
      rowsPerPage: 10,
      onChangePage,
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
          <BasicNewBtnWithDisabledState
            tooltip="New sequence"
            modalComponent={SaveSequenceModal}
            innerProps={{
              story,
              selectedChapterId,
              onSuccess: onSequenceSave,
              isStartSeq: false
            }}
          />
        );
      },
    };

    return (
      <TableCmp
        id={SEQUENCES_ADMIN_TABLE}
        tableRef={tableRef}
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
  tableRef: PropTypes.object,
  classes: PropTypes.object,
  className: PropTypes.string,
  story: PropTypes.instanceOf(StoryModel),
  sequences: PropTypes.arrayOf(PropTypes.instanceOf(SequenceModel)),
  queryParams: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
  }).isRequired,
  selectedChapterId: PropTypes.string.isRequired,
  onDeleteSequence: PropTypes.func.isRequired,
  onEditOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  onMoveSeqUp: PropTypes.func.isRequired,
  onMoveSeqDown: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onSequenceSave: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...customStyles(theme),
}))(SequenceTableCmp);
