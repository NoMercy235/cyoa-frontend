import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { AttributeModel } from '../../../../../infrastructure/models/AttributeModel';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import ViewRow from '../../../../../shared/components/table/actions/ViewRow';
import DeleteRow from '../../../../../shared/components/table/actions/DeleteRow';
import BasicNewAction from '../../../../../shared/components/form/BasicNewAction';
import SaveAttributeModal from './save-attribute/SaveAttributeModal';
import BasicEditAction from '../../../../../shared/components/form/BasicEditAction';
import { observer } from 'mobx-react';
import { renderAttributesTableTitle } from './AttributesTableTitle';

@observer
class AttributesTableCmp extends Component {
  onSelectAttribute = id => () => {
    this.props.onSelectAttribute(id);
  };

  onDeleteAttribute = id => () => {
    this.props.onDeleteAttribute(id);
  };

  getActions = row => {
    return (
      <div key={row._id} className={this.props.classes.actionsContainer}>
        <ViewRow onClick={this.onSelectAttribute(row._id)}/>
        <BasicEditAction
          resourceName="attribute"
          resource={row}
          modalComponent={SaveAttributeModal}
        />
        <DeleteRow
          title="Delete confirmation"
          description="Are you sure you want to delete this attribute?"
          onClick={this.onDeleteAttribute(row._id)}
        />
      </div>
    );
  };

  render() {
    const { attributes } = this.props;
    const columns = AttributeModel.getTableColumns();

    const data = attributes.map(a => {
      return [a.name, a.startValue, this.getActions(a)];
    });

    const options = {
      customToolbar: () => {
        return (
          <BasicNewAction
            tooltip="New attribute"
            modalComponent={SaveAttributeModal}
          />
        );
      },
    };

    return (
      <TableCmp
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
  onSelectAttribute: PropTypes.func.isRequired,
  onDeleteAttribute: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(AttributesTableCmp);
