import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { observer } from 'mobx-react';

import { AttributeModel } from '../../../../../infrastructure/models/AttributeModel';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import ViewRow from '../../../../../shared/components/table/actions/ViewRow';
import DeleteRow from '../../../../../shared/components/table/actions/DeleteRow';
import BasicNewAction from '../../../../../shared/components/form/BasicNewAction';
import SaveAttributeModal from './save-attribute/SaveAttributeModal';
import BasicEditAction from '../../../../../shared/components/form/BasicEditAction';
import { renderAttributesTableTitle } from './AttributesTableTitle';
import YesNoCmp from '../../../../../shared/components/table/YesNoCmp';
import withDisabledStoryPublished from '../../../../../shared/hoc/withDisabledStoryPublished';
import { ATTRIBUTES_ADMIN_TABLE } from '../../../../../shared/constants/tables';

import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';

const BasicNewBtnWithDisabledState = withDisabledStoryPublished(BasicNewAction);
const BasicEditBtnWithDisabledState = withDisabledStoryPublished(BasicEditAction);
const BasicDeleteBtnWithDisabledState = withDisabledStoryPublished(DeleteRow);

@observer
class AttributesTableCmp extends Component {
  onSelectAttribute = id => () => {
    this.props.onSelectAttribute(id);
  };

  onDeleteAttribute = id => () => {
    this.props.onDeleteAttribute(id);
  };

  getActions = row => {
    const { classes, onEditAttribute } = this.props;

    return (
      <div key={row._id} className={classes.actionsContainer}>
        <ViewRow onClick={this.onSelectAttribute(row._id)}/>
        <BasicEditBtnWithDisabledState
          resourceName="attribute"
          resource={row}
          modalComponent={SaveAttributeModal}
          getBeforeModal={onEditAttribute(row._id)}
        />
        <BasicDeleteBtnWithDisabledState
          title="Delete confirmation"
          description="Are you sure you want to delete this attribute?"
          onClick={this.onDeleteAttribute(row._id)}
        />
      </div>
    );
  };

  renderIsImportant = row => {
    return <YesNoCmp condition={row.isImportant}/>;
  };

  render() {
    const { attributes } = this.props;
    const columns = AttributeModel.getTableColumns();

    const data = attributes.map(a => {
      return [
        a.name,
        a.startValue,
        this.renderIsImportant(a),
        this.getActions(a),
      ];
    });

    const options = {
      customToolbar: () => {
        return (
          <BasicNewBtnWithDisabledState
            tooltip="New attribute"
            modalComponent={SaveAttributeModal}
          />
        );
      },
    };

    return (
      <TableCmp
        id={ATTRIBUTES_ADMIN_TABLE}
        title={renderAttributesTableTitle()}
        columns={columns}
        data={data}
        options={options}
      />
    );
  }
}

AttributesTableCmp.propTypes = {
  classes: PropTypes.object,
  attributes: PropTypes.arrayOf(PropTypes.shape(AttributeModel)),
  onEditAttribute: PropTypes.func.isRequired,
  onSelectAttribute: PropTypes.func.isRequired,
  onDeleteAttribute: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(AttributesTableCmp);
