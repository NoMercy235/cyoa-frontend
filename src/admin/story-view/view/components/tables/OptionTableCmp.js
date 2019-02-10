import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import { optionService } from '../../../../../infrastructure/services/OptionService';
import { OptionModel } from '../../../../../infrastructure/models/OptionModel';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../../stores/StoryViewStore';
import BasicNewAction from '../../../../../shared/components/form/BasicNewAction';
import SaveOptionModal from '../modals/save-option/SaveOptionModal';
import { Utils } from '@nomercy235/utils';
import BasicEditAction from '../../../../../shared/components/form/BasicEditAction';
import DeleteRow from '../../../../../shared/components/table/actions/DeleteRow';

@inject('storyViewStore')
@observer
class OptionTableCmp extends Component {
  getNextSeqName(option) {
    return Utils.safeAccess(
      this.props.storyViewStore.getSequenceById(option.nextSeq),
      'name'
    );
  }

  getAttributeName(consequence) {
    return Utils.safeAccess(
      this.props.storyViewStore.getAttributeById(consequence.attribute),
      'name',
    );
  }

  getConsequences(option) {
    return option.consequences.map((c, i) =>
      <div key={i}>
        <b>{this.getAttributeName(c)}</b>&nbsp;:&nbsp;<b>{c.changeValue}</b>
      </div>
    );
  }

  getOptions = async sequenceId => {
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);
    const options = await optionService.list();
    this.props.storyViewStore.setOptionsToSequence(sequenceId, options);
  };

  onDeleteOption = (sequenceId, id) => () => {
    this.props.onDeleteOption(sequenceId, id);
  };

  getActions = row => {
    return (
      <div key={row._id} className={this.props.classes.actionsContainer}>
        <BasicEditAction
          resourceName="option"
          resource={row}
          modalComponent={SaveOptionModal}
          innerProps={{ sequenceId: this.props.sequenceId }}
        />
        <DeleteRow
          title="Delete confirmation"
          description="Are you sure you want to delete this attribute?"
          onClick={this.onDeleteOption(row._id)}
        />
      </div>
    );
  };

  componentDidMount () {
    this.getOptions(this.props.sequenceId);
  }

  render() {
    const { sequenceId, storyViewStore } = this.props;
    const columns = OptionModel.getTableColumns();
    const options = storyViewStore.getSequenceOptions(sequenceId);

    const data = options.map(o => {
      return [
        o.action,
        this.getNextSeqName(o),
        this.getConsequences(o),
        this.getActions(o),
      ];
    });

    const tableOptions = {
      search: false,
      textLabels: {
        body: {
          noMatch: 'No options available',
        },
      },
      customToolbar: () => {
        return (
          <BasicNewAction
            tooltip="New option"
            modalComponent={SaveOptionModal}
            innerProps={{ sequenceId }}
          />
        );
      },
    };

    return (
      <TableCmp
        title="Options"
        columns={columns}
        data={data}
        options={tableOptions}
      />
    );
  }
}

OptionTableCmp.propTypes = {
  classes: PropTypes.object,
  sequenceId: PropTypes.string.isRequired,
  onDeleteOption: PropTypes.func.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(OptionTableCmp);
