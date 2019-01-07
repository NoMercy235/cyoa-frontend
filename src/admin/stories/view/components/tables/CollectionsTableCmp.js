import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { CollectionModel } from '../../../domain/models/CollectionModel';
import classNames from 'classnames';
import { styles as tableStyles } from '../../../style/TableCmp.css';
import { styles as collectionsTableStyles } from '../../../style/CollectionsTableCmp.css';
import { TableCell } from './TableCell';

let id = 0;
function createData(name, tags, created_at) {
  id += 1;
  return new CollectionModel({ _id: id, name, tags, created_at });
}

const rows = [
  createData('Heroine', ['test', 'me'], 'azi'),
  createData('The frozen lake', ['test', 'me'], 'azi'),
  createData('WIldest dreams', ['test', 'me'], 'azi'),
];


class CollectionsTableCmp extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Paper className={classNames(classes.root, classes.collectionsTable)}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {CollectionModel.getTableColumns().map((column, i) =>
                <TableCell key={i}>{column.label}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row =>
              <TableRow className={classes.row} key={row._id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

CollectionsTableCmp.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...collectionsTableStyles(theme),
}))(CollectionsTableCmp);
