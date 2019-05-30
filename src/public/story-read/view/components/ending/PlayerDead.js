import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { playerService } from '../../../../../infrastructure/services/PlayerService';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import styles from './Ending.module.scss';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import playerDead from '../../../../../assets/player-dead.png';

class PlayerDead extends Component {
  retry = async () => {
    await playerService.delete(this.props.player._id);
    window.location.reload();
  };

  getTitle = () => {
    return (
      <Typography
        variant="h4"
        color="inherit"
      >
        You have died
      </Typography>
    );
  };

  getContentText = () => {
    return (
      <>
        <img
          alt="Cover"
          src={playerDead}
        />
        <Typography
          variant="h6"
          color="inherit"
        >
          Your choices have led to impending doom. You lie on the ground with blurring vision thinking about what happened that led to this miserable fate.
        </Typography>
      </>
    );
  };

  render() {
    return (
      <Card>
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
          </div>
        </CardActions>
      </Card>
    );
  }
}

PlayerDead.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(PlayerDead);
