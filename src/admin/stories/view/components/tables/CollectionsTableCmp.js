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

class CollectionsTableCmp extends Component {
  onChangeCollection = (id) => () => {
    this.props.onChangeCollection(id);
  };

  render() {
    const { classes } = this.props;
    const collections = [
      new CollectionModel({ name: 'Default' }),
      ...this.props.collections,
    ];

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
            {collections.map(row =>
              <TableRow
                className={classes.row}
                key={row._id}
                hover={true}
                onClick={this.onChangeCollection(row._id)}
              >
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
  collections: PropTypes.arrayOf(PropTypes.shape(CollectionModel)),
  onChangeCollection: PropTypes.func,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...collectionsTableStyles(theme),
}))(CollectionsTableCmp);