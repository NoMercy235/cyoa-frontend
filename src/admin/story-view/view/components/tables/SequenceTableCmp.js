import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { styles as customStyles } from '../../../style/SequenceTableCmp.css';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import DeleteRow from '../../../../../shared/components/table/actions/DeleteRow';
import { SequenceModel } from '../../../../../infrastructure/models/SequenceModel';
import BasicEditAction from '../../../../../shared/components/form/BasicEditAction';
import SaveSequenceModal from '../modals/save-sequence/SaveSequenceModal';
import BasicNewAction from '../../../../../shared/components/form/BasicNewAction';
import OptionTableCmp from './OptionTableCmp';
import { observer } from 'mobx-react';

@observer
class SequenceTableCmp extends Component {
  onDeleteSequence = id => () => {
    this.props.onDeleteSequence(id);
  };

  getActions = row => {
    return (
      <div key={row._id} className={this.props.classes.actionsContainer}>
        <BasicEditAction
          resourceName="sequence"
          resource={row}
          modalComponent={SaveSequenceModal}
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
        <td colSpan="3" className={classes.optionsTableContainer}>
          <OptionTableCmp
            sequenceId={rowData[0]}
            onDeleteOption={this.props.onDeleteOption}
          />
        </td>
      </tr>
    );
  };

  render() {
    const { sequences } = this.props;
    const columns = SequenceModel.getTableColumns();

    const data = sequences.map(a => {
      return [a._id, a.name, this.getActions(a)];
    });

    const options = {
      expandableRows: true,
      renderExpandableRow: this.renderOptionsTable,
      customToolbar: () => {
        return (
          <BasicNewAction
            tooltip="New sequence"
            modalComponent={SaveSequenceModal}
          />
        );
      },
    };

    return (
      <TableCmp
        title="Sequences"
        columns={columns}
        data={data}
        options={options}
      />
    );
  }
}

SequenceTableCmp.propTypes = {
  classes: PropTypes.object,
  sequences: PropTypes.arrayOf(PropTypes.shape(SequenceModel)),
  onDeleteSequence: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...customStyles(theme),
}))(SequenceTableCmp);
