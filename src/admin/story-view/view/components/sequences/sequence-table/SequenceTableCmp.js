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
import { sequenceService } from '../../../../../../infrastructure/services/SequenceService';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';

@observer
class SequenceTableCmp extends Component {
  onDeleteSequence = id => () => {
    this.props.onDeleteSequence(id);
  };

  getSequence = async resource => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    return await sequenceService.get(resource._id);
  };

  getActions = row => {
    return (
      <div key={row._id} className={this.props.classes.actionsContainer}>
        <BasicEditAction
          resourceName="sequence"
          resource={row}
          modalComponent={SaveSequenceModal}
          getBeforeModal={this.getSequence}
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
    const { sequences } = this.props;
    const columns = SequenceModel.getTableColumns();

    const data = sequences.map(a => {
      return [a._id, a.name, a.authorNote, this.getActions(a)];
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
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...customStyles(theme),
}))(SequenceTableCmp);
