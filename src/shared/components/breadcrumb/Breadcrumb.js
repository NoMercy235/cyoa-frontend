import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles, Avatar, Chip } from '@material-ui/core';
import classNames from 'classnames';

import {
  adminBreadcrumb,
  profileBreadcrumb,
  publicBreadcrumb,
  storyReadBreadcrumb,
  storyViewBreadcrumb,
} from '../../constants/breadcrumbs';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../../admin/story-view/stores/StoryViewStore';

import styles from './Breadcrumb.module.scss';

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

  if (/\/admin\/profile/.test(path)) {
    return [
      adminBreadcrumb(),
      profileBreadcrumb(),
    ];
  }
};

@inject('storyViewStore')
@observer
class Breadcrumb extends Component {
  state = {
    breadcrumbs: getBreadCrumbs(),
  };

  handleClick = (bc, i) => () => {
    if (!this.isNotLast(i)) return;
    this.props.history.push(bc.path);
  };

  isNotLast = index => {
    return index < this.state.breadcrumbs.length - 1;
  };

  renderAvatar = (Icon, index) => {
    const { classes } = this.props;
    const isNotLast = this.isNotLast(index);

    return (
      <Avatar classes={{
        root: classNames(classes.avatar, {
          [classes.avatarActive]: isNotLast,
          [classes.avatarInactive]: !isNotLast,
        }),
      }}>
        <Icon />
      </Avatar>
    );
  };

  renderBreadcrumb = (bc, i) => {
    const label = typeof bc.label === 'function'
      ? bc.label(this.props.storyViewStore)
      : bc.label;

    return (
      <a
        key={i}
        href={bc.path}
        disabled={!this.isNotLast(i)}
        className={classNames(styles.breadcrumb, {
          [styles.flexOne]: bc.shouldHaveFlexOne,
        })}
      >
        <Chip
          classes={{ root: styles.innerBreadcrumb }}
          sizes='large'
          avatar={this.renderAvatar(bc.icon, i)}
          label={label}
          onClick={this.handleClick(bc, i)}
          clickable={this.isNotLast(i)}
          color={this.isNotLast(i) ? 'primary' : 'default'}
          variant="outlined"
        />
        {this.isNotLast(i) && <span>&nbsp;&gt;&nbsp;</span>}
      </a>
    );
  };

  render() {
    const { breadcrumbs } = this.state;

    return (
      <div className={styles.container}>
        {breadcrumbs.map(this.renderBreadcrumb)}
      </div>
    );
  }
}

Breadcrumb.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

// This is a workaround because of a CSS loading order issue present in the
// 4.0.1 version of Material UI.
// TODO: remove this when the issue is fixed.
export default withStyles(theme => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    fontSize: '1rem',
  },
  avatarActive: {
    backgroundColor: theme.palette.primary.main,
  },
  avatarInactive: {
    color: theme.palette.text.secondary,
  },
}))(
  withRouter(Breadcrumb)
);
