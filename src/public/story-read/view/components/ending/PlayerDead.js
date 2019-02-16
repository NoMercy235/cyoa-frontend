import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { playerService } from '../../../../../infrastructure/services/PlayerService';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';

class PlayerDead extends Component {
  retry = async () => {
    await playerService.delete(this.props.player._id);
    window.location.reload();
  };

  render() {
    return (
      <div>
        Player is dead.
        <Button
          variant="contained"
          color="primary"
          onClick={this.retry}
        >
          Try again?
        </Button>
      </div>
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
