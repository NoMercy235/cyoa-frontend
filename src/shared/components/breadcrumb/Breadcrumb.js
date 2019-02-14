import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import * as PropTypes from 'prop-types';
import styles from './Breadcrumb.module.scss';
import { withRouter } from 'react-router-dom';
import {
  adminBreadcrumb,
  publicBreadcrumb,
  storyReadBreadcrumb,
  storyViewBreadcrumb,
} from '../../constants/breadcrumbs';

const getBreadCrumbs = () => {
  const path = window.location.pathname;

  if (/\/public\/read\/[a-z0-9]+/.test(path)) {
    return [
      publicBreadcrumb(),
      storyReadBreadcrumb(),
    ];
  }

  if (/\/public/.test(path)) {
    return [
      publicBreadcrumb(),
    ];
  }

  if (/\/admin\/stories\/[a-z0-9]+/.test(path)) {
    return [
      adminBreadcrumb(),
      storyViewBreadcrumb(),
    ];
  }

  if (/\/admin\/stories/.test(path)) {
    return [
      adminBreadcrumb(),
    ];
  }
};

class Breadcrumb extends Component {
  state = {
    breadcrumbs: getBreadCrumbs(),
  };

  handleClick = (bc, i) => () => {
    if (!this.isNotLast(i)) return;
    this.props.history.push(bc.path);
  };

  isNotLast = (index) => {
    return index < this.state.breadcrumbs.length - 1;
  };

  render() {
    const { breadcrumbs } = this.state;

    return (
      <div className={styles.container}>
        {breadcrumbs.map((bc, i) => {
          const Icon = bc.icon;

          return (
            <span key={i} className={styles.breadcrumb}>
              <Chip
                avatar={
                  <Avatar>
                    <Icon />
                  </Avatar>
                }
                label={bc.label}
                onClick={this.handleClick(bc, i)}
                clickable={this.isNotLast(i)}
                color={this.isNotLast(i) ? 'primary' : 'default'}
                variant="outlined"
              />
              {this.isNotLast(i) && <span>&nbsp;&gt;&nbsp;</span>}
            </span>
          );
        })}
      </div>
    );
  }
}

Breadcrumb.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Breadcrumb);
