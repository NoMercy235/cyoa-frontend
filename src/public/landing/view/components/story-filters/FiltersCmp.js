import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Badge, IconButton, InputBase, Tooltip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/FilterList';
import { FiltersType } from '../../../stores/PublicStoryStore';

import { styles } from './Filters.css';

const withBadge = (Cmp, classes) => {
  return (
    <Badge
      variant="dot"
      color="secondary"
      badgeContent="A"
      className={classes.advancedFiltersBadge}
    >
      {Cmp}
    </Badge>
  );
};

class FiltersCmp extends Component {
  renderFilterIcon = () => {
    const {
      onOpenAdvancedFilters,
    } = this.props;

    return (
      <Tooltip title="Advanced Filters">
        <IconButton
          onClick={onOpenAdvancedFilters}
          color="inherit"
        >
          <FilterIcon />
        </IconButton>
      </Tooltip>
    );
  };

  render() {
    const {
      classes,
      filterType,
      quickSearchValue,
      onQuickSearch,
    } = this.props;

    return (
      <>
        {filterType === FiltersType.Advanced
          ? withBadge(this.renderFilterIcon(), classes)
          : this.renderFilterIcon()
        }
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
          />
        </div>
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
