import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import { PlayerModel } from '../../../../infrastructure/models/PlayerModel';
import PlayerDead from '../components/ending/PlayerDead';
import StoryFinished from '../components/ending/StoryFinished';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';

class EndingContainer extends Component {
  renderStoryFinished = () => {
    const { player, onlineStatus } = this.props;
    return (
      <StoryFinished
        player={player}
        onlineStatus={onlineStatus}
      />
    );
  };

  renderPlayerDead = () => {
    const { player, story, onlineStatus } = this.props;
    return (
      <PlayerDead
        player={player}
        story={story}
        onlineStatus={onlineStatus}
      />
    );
  };

  render() {
    const { isDead, hasWon } = this.props;

    if (isDead) {
      return this.renderPlayerDead();
    } else if (hasWon) {
      return this.renderStoryFinished();
    }
  }
}

EndingContainer.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  // This one is deprecated. Probably will remove in the future
  isDead: PropTypes.bool,
  hasWon: PropTypes.bool.isRequired,
  onlineStatus: PropTypes.bool.isRequired,
};

export default EndingContainer;
