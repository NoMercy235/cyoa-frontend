import React, { Component } from 'react';
import { styles } from './Filters.css';
import { withStyles } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import StoryFilters from './StoryFilters';

class AdvancedFiltersCmp extends Component {
  render() {
    const {
      classes,
      open,
      currentAdvancedFilters,
      onAdvancedSearch,
      onHandleDrawerClose,
    } = this.props;

    return (
      <Drawer
        anchor="top"
        open={open}
        onClose={onHandleDrawerClose}
        classes={{ paper: classes.advancedFiltersDrawer }}
      >
        <StoryFilters
          initialValues={currentAdvancedFilters}
          onSearch={onAdvancedSearch}
        />
      </Drawer>
    );
  }
}

AdvancedFiltersCmp.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  currentAdvancedFilters: PropTypes.shape({
    tags: PropTypes.array.isRequired,
    titleOrDescription: PropTypes.string.isRequired,
    authorShort: PropTypes.string.isRequired,
  }).isRequired,
  onAdvancedSearch: PropTypes.func.isRequired,
  onHandleDrawerClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(AdvancedFiltersCmp);
