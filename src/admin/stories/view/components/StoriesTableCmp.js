import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as storiesTableStyles } from '../../style/StoriesTableCmp.css';
import { styles as tableStyles } from '../../style/TableCmp.css';
import { StoryModel } from '../../domain/StoryModel';
import classNames from 'classnames';
import { TableCell } from './TableCell';

let id = 0;
function createData(name, tags, created_at) {
  id += 1;
  return new StoryModel({ _id: id, name, tags, created_at });
}

const rows = [
  createData('Heroine', ['test', 'me'], 'azi'),
  createData('The frozen lake', ['test', 'me'], 'azi'),
  createData('WIldest dreams', ['test', 'me'], 'azi'),
];


class StoriesTableCmp extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Paper className={classNames(classes.root, classes.storiesTable)}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {StoryModel.getTableColumns().map((column, i) =>
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
                <TableCell align="right">{row.tags.join(', ')}</TableCell>
                <TableCell align="right">{row.created_at}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

StoriesTableCmp.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...storiesTableStyles(theme),
}))(StoriesTableCmp);
