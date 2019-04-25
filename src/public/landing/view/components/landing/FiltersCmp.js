import React, { Component } from 'react';
import { styles } from './FiltersCmp.css';
import { withStyles } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

class FiltersCmp extends Component {
  render() {
    const { classes, onChange } = this.props;

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search..."
          onChange={onChange}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
        />
      </div>
    );
  }
}

FiltersCmp.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(FiltersCmp);
