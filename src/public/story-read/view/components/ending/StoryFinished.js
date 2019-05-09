import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { LANDING_ROUTE } from '../../../../../shared/constants/routes';
import { withRouter } from 'react-router-dom';
import { playerService } from '../../../../../infrastructure/services/PlayerService';
import Button from '@material-ui/core/Button';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import styles from './Ending.module.scss';
import Typography from '@material-ui/core/Typography';

class StoryFinished extends Component {
  deletePlayer = async () => {
    await playerService.delete(this.props.player._id);
  };

  retry = async () => {
    await this.deletePlayer();
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
        <CardActions disableActionSpacing>
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
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(StoryFinished);
