import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { withStyles, Button, CardActions, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { makeReadStoryPath } from '../../../../../shared/constants/routes';
import ShareButton from '../ShareButton';
import withOnlineCheck from '../../../../../shared/hoc/withOnlineCheck';

import { styles } from './StoryBox.css';

const ReadStoryButton = withOnlineCheck(Button);

class StoryActions extends Component {
  goToReadStory = history => () => {
    const url = makeReadStoryPath(this.props.story.id);
    history.push(url);
  };

  renderReadButton = () => {
    const { classes, isAvailableOffline } = this.props;

    const StoryBtn = isAvailableOffline ? Button : ReadStoryButton;

    const Btn = withRouter(({ history }) => (
      <StoryBtn
        onClick={this.goToReadStory(history)}
      >
        <span className={classes.readStoryLabel}>Read</span>
        <VisibilityIcon fontSize="default" />
      </StoryBtn>
    ));

    return <Btn />;
  };

  renderIconButton = () => {
    const { classes, expanded, handleExpandClick } = this.props;

    return (
      <IconButton
        className={classNames(classes.expand, {
          [classes.expandOpen]: expanded,
        })}
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="Show more"
      >
        <ExpandMoreIcon />
      </IconButton>
    );
  };

  render() {
    const { classes, story } = this.props;

    return (
      <CardActions className={classes.actions} disableSpacing>
        {this.renderReadButton()}
        <ShareButton text={makeReadStoryPath(story.id, true)}/>
        {this.renderIconButton()}
      </CardActions>
    );
  }
}

StoryActions.propTypes = {
  classes: PropTypes.object.isRequired,
  story: PropTypes.instanceOf(StoryModel).isRequired,
  expanded: PropTypes.bool.isRequired,
  isAvailableOffline: PropTypes.bool.isRequired,

  handleExpandClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(StoryActions);
