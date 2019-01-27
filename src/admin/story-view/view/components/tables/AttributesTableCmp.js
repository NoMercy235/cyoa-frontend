import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { withConfirmation } from '../../../../../shared/hoc/withConfirmation';
import { AttributeModel } from '../../../domain/models/AttributeModel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditAttribute from '../actions/EditAttribute';
import NewAttribute from '../actions/NewAttribute';
import TableCmp from '../../../../../shared/components/table/TableCmp';

const IconButtonHOC = withConfirmation(IconButton);

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
        <IconButton
          onClick={this.onSelectAttribute(row._id)}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <EditAttribute attribute={row} />
        <IconButtonHOC
          title="Delete confirmation"
          description="Are you sure you want to delete this attribute?"
          onClick={this.onDeleteAttribute(row._id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButtonHOC>
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
