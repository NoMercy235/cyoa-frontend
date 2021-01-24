import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { appStorePropTypes } from '../../store/AppStore';
import { ADMIN_STORIES_ROUTE } from '../../constants/routes';

import classes from './NoResultsFound.module.scss';

import noResultsGhost from '../../../assets/no-results-ghost.ico';

@inject('appStore')
@observer
class NoResultsFound extends Component {

  renderWriteItYourself = () => {
    if (!this.props.appStore.isLoggedIn) {
      return '';
    }

    return (
      <Link
        to={{ pathname: ADMIN_STORIES_ROUTE }}
      >
        <Button
          color="primary"
          variant="contained"
        >
          Why not write one yourself?
        </Button>
      </Link>
    );
  };

  render() {
    const { show } = this.props;
    const result = typeof show === 'function'
      ? show()
      : show;
    if (!result) return null;

    return (
      <div className={classes.container}>
        <Typography
          variant="h4"
          color="inherit"
          noWrap
        >
          Sadly, there were no results found
        </Typography>
        <img
          alt="No results found"
          src={noResultsGhost}
        />
        {this.renderWriteItYourself()}
      </div>
    );
  }
}

NoResultsFound.propTypes = {
  show: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  appStore: appStorePropTypes,
};

export default NoResultsFound;
