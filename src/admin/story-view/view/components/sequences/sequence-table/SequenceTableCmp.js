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

  getActions = (row, index) => {
    const { classes, sequences, story } = this.props;
    const { canReorder } = this.state;

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
          innerProps={{ story }}
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
    const { classes } = this.props;
    return (
      <tr>
        <td colSpan="4" className={classes.optionsTableContainer}>
          <OptionTableCmp
            sequenceId={rowData[0]}
            onDeleteOption={this.props.onDeleteOption}
          />
        </td>
      </tr>
    );
  };

  render() {
    const { sequences, story } = this.props;
    const columns = SequenceModel.getTableColumns();

    const data = sequences.map((a, i) => {
      return [a._id, a.name, a.authorNote, this.getActions(a, i)];
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
            innerProps={{ story }}
          />
        );
      },
    };

    return (
      <TableCmp
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
  story: PropTypes.instanceOf(StoryModel),
  sequences: PropTypes.arrayOf(PropTypes.shape(SequenceModel)),
  onDeleteSequence: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  onMoveSeqUp: PropTypes.func.isRequired,
  onMoveSeqDown: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...customStyles(theme),
}))(SequenceTableCmp);
