import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from './TableCmp.css';
import MUIDataTable from 'mui-datatables';


class TableCmp extends Component {
  defaultOptions = {
    search: false,
    download: false,
    print: false,
    selectableRows: false,
    filter: false,
    viewColumns: false,
    // TODO: this should be set to true when the pagination is complete
    pagination: false,
    serverSide: true,
    onTableChange: (action, tableState) => {
      console.log('table has changed', action, tableState);
    },
  };

  render() {
    const options = Object.assign({}, this.defaultOptions, this.props.options);
    const { title, columns, data, classes } = this.props;

    return (
      <Paper className={classes.root}>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={options}
        />
      </Paper>
    );
  }
}

TableCmp.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(TableCmp);
