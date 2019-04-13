import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as tableStyles } from './TableCmp.css';
import MUIDataTable from 'mui-datatables';
import classNames from 'classnames';

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
    const { title, columns, data, classes, className } = this.props;

    return (
      <Paper className={classNames(classes.root, className)}>
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
  className: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string, PropTypes.object,
  ]).isRequired,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
}))(TableCmp);
