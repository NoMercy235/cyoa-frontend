import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { PlayerModel } from '../../../../infrastructure/models/PlayerModel';
import PlayerDead from '../components/ending/PlayerDead';

class EndingContainer extends Component {
  render() {
    return (
      <Fragment>
        <PlayerDead />
      </Fragment>
    );
  }
}

EndingContainer.propTypes = {
  player: PropTypes.instanceOf(PlayerModel).isRequired,
};

export default EndingContainer;
