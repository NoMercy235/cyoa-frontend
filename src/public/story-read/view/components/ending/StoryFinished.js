import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { LANDING_ROUTE } from '../../../../../shared/constants/routes';
import { withRouter } from 'react-router-dom';
import { playerService } from '../../../../../infrastructure/services/PlayerService';
import Button from '@material-ui/core/Button';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';

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

  render() {
    return (
      <div>
        Story finished! Congrats!
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
