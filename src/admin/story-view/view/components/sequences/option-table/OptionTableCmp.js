import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, IconButton, Tooltip } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import WarningIcon from '@material-ui/icons/WarningRounded';

import TableCmp from '../../../../../../shared/components/table/TableCmp';
import { optionService } from '../../../../../../infrastructure/services/OptionService';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import SaveOptionModal from '../save-option/SaveOptionModal';
import BasicEditAction from '../../../../../../shared/components/form/BasicEditAction';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';
import { renderOptionTableTitle } from './OptionTableTitle';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import withDisabledStoryPublished from '../../../../../../shared/hoc/withDisabledStoryPublished';

import { styles as tableStyles } from '../../../../../../shared/components/table/TableCmp.css';

const BasicNewBtnWithDisabledState = withDisabledStoryPublished(BasicNewAction);
const BasicEditBtnWithDisabledState = withDisabledStoryPublished(BasicEditAction);
const BasicDeleteBtnWithDisabledState = withDisabledStoryPublished(DeleteRow);

@inject('storyViewStore')
@observer
class OptionTableCmp extends Component {
  editRef = React.createRef();

  onWarningClick = e => {
    this.editRef.current.onShowModal(e);
  };

  getNextSeqName = ({ nextSeq }) => {
    return nextSeq
      ? nextSeq.name
      : (
        <Tooltip title="The sequence no longer exists. Please update.">
          <IconButton onClick={this.onWarningClick}>
            <WarningIcon
              color="secondary"
            />
          </IconButton>
        </Tooltip>
      );
  };

  getConsequences(option) {
    return option.consequences
      .filter(c => c.attribute)
      .map((attr, i) =>
        <div key={i}>
          <b>{attr.attribute}</b>&nbsp;:&nbsp;<b>{attr.changeValue}</b>
        </div>
      );
  }

  getOptions = async () => {
    const { sequence: { _id: id } } = this.props;
    const params = { ':sequence': id };
    optionService.setNextRouteParams(params);
    const options = await optionService.list();
    this.props.storyViewStore.setOptionsToSequence(id, options);
  };

  onEditOption = id => async () => {
    return await this.props.onEditOption(this.props.sequence._id, id);
  };

  onDeleteOption = id => () => {
    this.props.onDeleteOption(this.props.sequence._id, id);
  };

  getActions = row => {
    // The options property is marked as an observable and that's
    // why React complains when it sees the boxed version of its value.
    // To get around that, we need to unbox it and create a new model.
    // toJS is imported from mobx
    // const unboxedRow = new OptionModel(toJS(row));

    // Or we can just not render the actions until the observable gets unboxed
    // automatically.
    if (!(row instanceof OptionModel)) return '';

    const { classes, sequence: { _id: seqId } } = this.props;

    return (
      <div key={row._id} className={classes.actionsContainer}>
        <BasicEditBtnWithDisabledState
          ref={this.editRef}
          resourceName="option"
          resource={row}
          modalComponent={SaveOptionModal}
          innerProps={{ sequenceId: seqId }}
          getBeforeModal={this.onEditOption(row._id)}
        />
        <BasicDeleteBtnWithDisabledState
          title="Delete confirmation"
          description="Are you sure you want to delete this attribute?"
          onClick={this.onDeleteOption(row._id)}
        />
      </div>
    );
  };

  componentDidMount () {
    this.getOptions();
  }

  render() {
    const { sequence } = this.props;
    const columns = OptionModel.getTableColumns();

    const data = sequence.options.map(o => {
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
          <BasicNewBtnWithDisabledState
            tooltip="New option"
            modalComponent={SaveOptionModal}
            innerProps={{ sequenceId: sequence._id }}
          />
        );
      },
    };

    return (
      <TableCmp
        title={renderOptionTableTitle()}
        columns={columns}
        data={data}
        options={tableOptions}
      />
    );
  }
}

OptionTableCmp.propTypes = {
  classes: PropTypes.object,
  sequence: PropTypes.instanceOf(SequenceModel).isRequired,
  onEditOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(OptionTableCmp);
