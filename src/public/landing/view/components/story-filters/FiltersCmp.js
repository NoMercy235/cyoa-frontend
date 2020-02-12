import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, IconButton, InputBase, Tooltip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/FilterList';
import { FiltersType } from '../../../stores/PublicStoryStore';

import { styles } from './Filters.css';

class FiltersCmp extends Component {
  renderFilterIcon = () => {
    const {
      filterType,
      onOpenAdvancedFilters,
    } = this.props;

    return (
      <Tooltip title="Advanced Filters">
        <IconButton
          onClick={onOpenAdvancedFilters}
          color={filterType === FiltersType.Advanced ? "secondary" : "inherit"}
        >
          <FilterIcon />
        </IconButton>
      </Tooltip>
    );
  };

  render() {
    const {
      classes,
      quickSearchValue,
      onQuickSearch,
    } = this.props;

    return (
      <>
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
            value={quickSearchValue}
            inputProps={{
             'aria-label': 'Quick search',
            }}
          />
        </div>
        {this.renderFilterIcon()}
      </>
    );
  }
}

FiltersCmp.propTypes = {
  classes: PropTypes.object.isRequired,
  filterType: PropTypes.string.isRequired,
  quickSearchValue: PropTypes.string.isRequired,
  onQuickSearch: PropTypes.func.isRequired,
  onOpenAdvancedFilters: PropTypes.func.isRequired,
};

export default withStyles(styles)(FiltersCmp);
