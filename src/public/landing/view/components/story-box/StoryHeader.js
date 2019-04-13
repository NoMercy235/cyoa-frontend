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

class StoryHeader extends Component {
  state = { expanded: false, coverPic: '' };

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

  renderSubheader = () => {
    const { story } = this.props;
    // return [
    //   `By <b>${story.authorShort}</b>`,
    //   `on ${story.createdAtShort}.`,
    //   `Tags: ${(story.tagsName || []).join(', ')}`,
    // ].filter(v => v).join('');

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
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={this.renderTitle()}
        subheader={this.renderSubheader()}
      />
    );
  }
}

StoryHeader.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryHeader);
