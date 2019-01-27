import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { TableCell } from '../../../../../shared/components/table/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';
import sharedClasses from '../../../../../shared/components/table/TableContainer.module.scss';
import IconButton from '@material-ui/core/IconButton';
import { withConfirmation } from '../../../../../shared/hoc/withConfirmation';
import { AttributeModel } from '../../../domain/models/AttributeModel';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditAttribute from '../actions/EditAttribute';

const IconButtonHOC = withConfirmation(IconButton);

class AttributesTableCmp extends Component {
  onSelectAttribute = id => () => {
    this.props.onSelectAttribute(id);
  };

  onDeleteAttribute = id => () => {
    this.props.onDeleteAttribute(id);
  };

  render() {
    const { classes, attributes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead className={classes.header}>
            <TableRow className={classes.thead}>
              {AttributeModel.getTableColumns().map((column, i) =>
                <TableCell className={classes.cell} key={i}>
                  {column.label}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {attributes.map(row =>
              <TableRow
                className={classNames(classes.row, sharedClasses.row)}
                key={row._id}
                hover={true}
              >
                <TableCell className={classes.cell}>
                  <span
                    className={classes.clickableText}
                    onClick={this.onSelectAttribute(row._id)}
                  >
                    {row.name}
                  </span>
                </TableCell>
                <TableCell className={classes.cell}>
                  <span
                    className={classes.textWithActionsContainer}
                  >
                    {row.startValue}
                  </span>
                  <div className={sharedClasses.actionsContainer}>
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
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
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
