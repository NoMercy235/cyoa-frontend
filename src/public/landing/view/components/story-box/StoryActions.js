import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { withRouter } from 'react-router-dom';
import { makePath, READ_STORY_ROUTE } from '../../../../../shared/constants/routes';
import ShareButton from '../ShareButton';
import { styles } from './StoryBox.css';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';

class StoryActions extends Component {
  makePath = (withOrigin = false) => {
    let path = '';
    if (withOrigin) {
      path += window.location.origin;
    }
    path += makePath(
      READ_STORY_ROUTE,
      {
        ':storyId': this.props.story._id,
      }
    );
    return path;
  };

  goToReadStory = history => () => {
    history.push(this.makePath());
  };

  getReadBtn = () => {
    const { classes } = this.props;
    const Btn = withRouter(({ history }) => (
      <Button
        onClick={this.goToReadStory(history)}
      >
        <span className={classes.readStoryLabel}>Read</span>
        <VisibilityIcon fontSize="default" />
      </Button>
    ));

    return <Btn />;
  };

  render() {
    const { classes } = this.props;

    return (
      <CardActions className={classes.actions} disableActionSpacing>
        {this.getReadBtn()}
        <ShareButton text={this.makePath(true)}/>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: this.props.expanded,
          })}
          onClick={this.props.handleExpandClick}
          aria-expanded={this.props.expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
    );
  }
}

StoryActions.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  expanded: PropTypes.bool.isRequired,
  handleExpandClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryActions);
