import React, { Component } from 'react';
import { styles } from './Filters.css';
import { withStyles } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';

class FiltersCmp extends Component {
  render() {
    const {
      classes,
      onQuickSearch,
      onOpenAdvancedFilters,
    } = this.props;

    return (
      <>
        <Tooltip title="Advanced Filters">
          <FilterIcon
            className={classes.advancedFilters}
            onClick={onOpenAdvancedFilters}
          />
        </Tooltip>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search..."
            onChange={onQuickSearch}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
      </>
    );
  }
}

FiltersCmp.propTypes = {
  classes: PropTypes.object.isRequired,
  onQuickSearch: PropTypes.func.isRequired,
  onOpenAdvancedFilters: PropTypes.func.isRequired,
};

export default withStyles(styles)(FiltersCmp);
