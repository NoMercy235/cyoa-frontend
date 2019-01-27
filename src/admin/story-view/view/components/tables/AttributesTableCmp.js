import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { AttributeModel } from '../../../domain/models/AttributeModel';
import EditAttribute from '../actions/EditAttribute';
import NewAttribute from '../actions/NewAttribute';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import ViewRow from '../../../../../shared/components/table/actions/ViewRow';
import DeleteRow from '../../../../../shared/components/table/actions/DeleteRow';

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
        <EditAttribute attribute={row} />
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
        return <NewAttribute />;
      },
    };

    return (
      <TableCmp
        title="Attributes"
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
