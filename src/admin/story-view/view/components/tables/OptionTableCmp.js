import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import { optionService } from '../../../domain/services/OptionService';
import { OptionModel } from '../../../domain/models/OptionModel';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../../domain/stores/StoryViewStore';
import BasicNewAction from '../../../../../shared/components/form/BasicNewAction';
import SaveOptionModal from '../modals/save-option/SaveOptionModal';
import { Utils } from '@nomercy235/utils';

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
        this.getConsequences(o)];
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

  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(OptionTableCmp);
