import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import { optionService } from '../../../domain/services/OptionService';
import { OptionModel } from '../../../domain/models/OptionModel';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../../domain/stores/StoryViewStore';

@inject('storyViewStore')
@observer
class OptionTableCmp extends Component {
  state = {
    options: [],
  };

  getNextSeqName(option) {
    return this.props.storyViewStore.getSequenceById(option.nextSeq).name;
  }

  getOptions = async sequenceId => {
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);
    const options = await optionService.list();
    this.setState({ options });
  };

  componentDidMount () {
    this.getOptions(this.props.sequenceId);
  }

  render() {
    const { options } = this.state;
    const columns = OptionModel.getTableColumns();

    const data = options.map(o => {
      return [
        o.action,
        this.getNextSeqName(o),
        'consequence'];
    });

    const tableOptions = {
      search: false,
      textLabels: {
        body: {
          noMatch: 'No results available',
        },
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
