import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import MUIDataTable from 'mui-datatables';
import { withStyles, Paper, CircularProgress } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';

import { getMuiTheme, styles as tableStyles } from './TableCmp.css';

@inject('appStore')
@observer
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

  shouldShowLoading = () => {
    const { id, appStore: { currentLoadingAnimation } } = this.props;
    return currentLoadingAnimation.includes(id);
  };

  renderLoadingContainer = () => {
    const { classes } = this.props;

    if (!this.shouldShowLoading()) return null;

    return (
      <div className={classes.loadingContainer}>
        <CircularProgress
          thickness={5}
          size={150}
        />
      </div>
    );
  };

  render() {
    const options = Object.assign({}, this.defaultOptions, this.props.options);
    const { id, tableRef, title, columns, data, classes, className } = this.props;

    return (
      <Paper id={id} className={classNames(classes.root, className)}>
        {this.renderLoadingContainer()}
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            innerRef={tableRef}
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
  id: PropTypes.string.isRequired,
  tableRef: PropTypes.object,
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
