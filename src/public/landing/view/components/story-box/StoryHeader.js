import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import {
  withStyles,
  Avatar,
  CardHeader,
  IconButton,
  Switch,
  Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classNames from 'classnames';

import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import MenuDropdown from '../../../../../shared/components/menu/MenuDropdown';
import { appStorePropTypes } from '../../../../../shared/store/AppStore';
import { makeReadStoryPath } from '../../../../../shared/constants/routes';
import AuthorSummary from '../AuthorSummary/AuthorSummary';

import { styles } from './StoryBox.css';

@inject('appStore')
@observer
class StoryHeader extends Component {
  state = {
    isMakingOffline: false,
  };

  onMakeAvailableTextClick = async e => {
    const { story } = this.props;
    const currentOffline = await story.isOffline();
    await this.onMakeAvailableOfflineChange(e, !currentOffline);
  };

  onMakeAvailableOfflineChange = async (e, isAvailableOffline) => {
    const {
      appStore: { onlineStatus },
      makeStoryAvailableOffline,
    } = this.props;

    if (!onlineStatus) return;

    this.setState({ isMakingOffline: true });
    await makeStoryAvailableOffline(isAvailableOffline);
    this.setState({ isMakingOffline: false });
  };

  goToReadStory = history => () => {
    const url = makeReadStoryPath(this.props.story._id);
    history.push(url);
  };

  renderTitle = () => {
    const {
      classes,
      story,
      isAvailableOffline,
      appStore: { onlineStatus },
    } = this.props;

    const shouldBeClickable = onlineStatus || isAvailableOffline;

    const Title = withRouter(({ history }) => (
      <Typography
        variant="h6"
        color="inherit"
      >
        <span
          className={classNames({ [classes.storyTitle]: shouldBeClickable })}
          {...(shouldBeClickable ? { onClick: this.goToReadStory(history) } : {})}
        >
          {story.name}
        </span>
      </Typography>
    ));

    return <Title/>;
  };

  renderIsAvailableOffline = () => {
    const {
      story,
      isAvailableOffline,
      appStore: {
        canUseIdb,
        onlineStatus,
      },
    } = this.props;
    const { isMakingOffline } = this.state;

    if (!story.isAvailableOffline || !canUseIdb) return false;

    return (
      <div onClick={this.onMakeAvailableTextClick}>
        Available offline?
        <Switch
          value={isAvailableOffline}
          checked={isAvailableOffline}
          onChange={this.onMakeAvailableOfflineChange}
          disabled={isMakingOffline || !onlineStatus}
        />
      </div>
    );
  };

  getMenuItems = () => {
    return [
      this.renderIsAvailableOffline(),
    ].filter(el => el);
  };

  renderAction = () => {
    const items = this.getMenuItems();

    return !!items.length && (
      <MenuDropdown
        items={this.getMenuItems()}
        closeOnItemClick={false}
      >
        <IconButton aria-label="More story actions">
          <MoreVertIcon />
        </IconButton>
      </MenuDropdown>
    );
  };

  renderAuthorSummary = () => {
    const { story: { author, authorShort } } = this.props;
    return (
      <AuthorSummary
        authorId={author}
        authorName={authorShort}
      />
    );
  };

  renderSubheader = () => {
    const { story } = this.props;
    const tags = (story.tagsName || []).join(', ');

    return (
      <>
        By {this.renderAuthorSummary()} on {story.createdAtShort} <i>({tags})</i>
      </>
    );
  };

  render() {
    const { story, classes } = this.props;

    return (
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>
            {(story.authorShort[0] || 'N/A').toUpperCase()}
          </Avatar>
        }
        action={this.renderAction()}
        title={this.renderTitle()}
        subheader={this.renderSubheader()}
      />
    );
  }
}

StoryHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  story: PropTypes.instanceOf(StoryModel).isRequired,
  isAvailableOffline: PropTypes.bool.isRequired,
  appStore: appStorePropTypes,

  makeStoryAvailableOffline: PropTypes.func.isRequired,
};

export default withStyles(styles)(StoryHeader);
