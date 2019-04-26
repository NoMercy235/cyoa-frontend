import React, { Component } from 'react';
import { styles } from './Filters.css';
import { withStyles } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import FilterIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';

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
      classes,
      onOpenAdvancedFilters,
    } = this.props;

    return (
      <Tooltip title="Advanced Filters">
        <FilterIcon
          className={classes.advancedFilters}
          onClick={onOpenAdvancedFilters}
        />
      </Tooltip>
    );
  };

  render() {
    const {
      classes,
      hasAdvancedFilters,
      quickSearchValue,
      onQuickSearch,
    } = this.props;

    return (
      <>
        {hasAdvancedFilters
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
  hasAdvancedFilters: PropTypes.bool.isRequired,
  quickSearchValue: PropTypes.string.isRequired,
  onQuickSearch: PropTypes.func.isRequired,
  onOpenAdvancedFilters: PropTypes.func.isRequired,
};

export default withStyles(styles)(FiltersCmp);
