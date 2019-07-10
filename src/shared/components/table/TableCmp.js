import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import MUIDataTable from 'mui-datatables';
import { withStyles, Paper } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { getMuiTheme, styles as tableStyles } from './TableCmp.css';

class TableCmp extends Component {
  defaultOptions = {
    search: false,
    download: false,
    print: false,
    selectableRows: 'none',
    filter: false,
    viewColumns: false,
    // TODO: this should be set to true when the pagination is complete
    pagination: false,
    serverSide: true,
    responsive: 'scroll',
    onTableChange: (action, tableState) => {
      console.log('table has changed', action, tableState);
    },
  };

  render() {
    const options = Object.assign({}, this.defaultOptions, this.props.options);
    const { title, columns, data, classes, className } = this.props;

    return (
      <Paper className={classNames(classes.root, className)}>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={title}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </Paper>
    );
  }
}

TableCmp.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string, PropTypes.object,
  ]).isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
};

export default withStyles(tableStyles)(TableCmp);
