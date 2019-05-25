import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { styles } from './StoryBox.css';
import Typography from '@material-ui/core/Typography';
import MenuDropdown from '../../../../../shared/components/menu/MenuDropdown';
import Switch from '@material-ui/core/Switch';

class StoryHeader extends Component {
  renderTitle = () => {
    const { story } = this.props;
    return (
      <Typography
        variant="h6"
        color="inherit"
      >
        {story.name}
      </Typography>
    );
  };

  renderIsAvailableOffline = () => {
    const { story, isAvailableOffline } = this.props;

    if (!story.isAvailableOffline) return false;

    return (
      <div onClick={this.props.makeStoryAvailableOffline}>
        Make available offline
        <Switch
          value={isAvailableOffline}
          checked={isAvailableOffline}
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
    return (
      <MenuDropdown
        items={this.getMenuItems()}
        closeOnItemClick={false}
      >
        <IconButton onClick={this.handleClick}>
          <MoreVertIcon />
        </IconButton>
      </MenuDropdown>
    );
  };

  renderSubheader = () => {
    const { story } = this.props;
    const tags = (story.tagsName || []).join(', ');

    return (
      <>
        By <b>{story.authorShort}</b> on {story.createdAtShort} <i>({tags})</i>.
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

  makeStoryAvailableOffline: PropTypes.func.isRequired,
};

export default withStyles(styles)(StoryHeader);
