import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { styles } from './StoryBox.css';

class StoryHeader extends Component {
  state = { expanded: false, coverPic: '' };

  getSubheader = () => {
    const { story } = this.props;
    return [
      story.authorShort,
      story.createdAtShort,
      (story.tagsName || []).join(', '),
    ].filter(v => v).join(' - ');
  };

  render() {
    const { story, classes } = this.props;

    return (
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" className={classes.avatar}>
            {(story.authorShort[0] || 'N/A').toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={story.name}
        subheader={this.getSubheader()}
      />
    );
  }
}

StoryHeader.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryHeader);
