import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';

import { LANDING_ROUTE } from '../../../../../shared/constants/routes';
import { playerService } from '../../../../../infrastructure/services/PlayerService';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';

import styles from './Ending.module.scss';

class StoryFinished extends Component {
  retry = async () => {
    const { onlineStatus, player } = this.props;
    onlineStatus && await playerService.delete(player._id);
    window.location.reload();
  };

  readOtherStories = async () => {
    this.props.history.push(LANDING_ROUTE);
  };

  getTitle = () => {
    return (
      <Typography
        variant="h4"
        color="inherit"
      >
        Story completed!
      </Typography>
    );
  };

  getContentText = () => {
    return (
      <>
        <Typography
          variant="h6"
          color="inherit"
        >
          You have reached the end of the story. There may be more paths to discover, so you may want to try going through it again and discover other possibilities.
        </Typography>
        <Typography
          variant="h6"
          color="inherit"
        >
          On the other hand, many different adventures await, so you can go ahead and read something else to satisfy your curiosity.
        </Typography>
      </>
    );
  };

  render() {
    return (
      <Card classes={{ root: styles.card }}>
        <CardHeader title={this.getTitle()}/>
        <CardContent>
          {this.getContentText()}
        </CardContent>
        <CardActions disableSpacing>
          <div className={styles.actionsContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.retry}
            >
              Try again?
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.readOtherStories}
            >
              Read other stories?
            </Button>
          </div>
        </CardActions>
      </Card>
    );
  }
}

StoryFinished.propTypes = {
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  story: PropTypes.instanceOf(StoryModel).isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onlineStatus: PropTypes.bool.isRequired,
};

export default withRouter(StoryFinished);
