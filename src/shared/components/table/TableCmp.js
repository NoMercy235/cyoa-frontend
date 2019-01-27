import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from './TableCmp.css';
import MUIDataTable from 'mui-datatables';


class TableCmp extends Component {
  defaultOptions = {
    download: false,
    print: false,
    selectableRows: false,
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
    const { classes, data, columns } = this.props;

    return (
      <Paper className={classes.root}>
        <MUIDataTable
          title="Attributes"
          data={data}
          columns={columns}
          options={options}
        />
      </Paper>
    );
  }
}

TableCmp.propTypes = {
  options: PropTypes.object,
  classes: PropTypes.object,
  data: PropTypes.array,
  columns: PropTypes.array,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(TableCmp);
