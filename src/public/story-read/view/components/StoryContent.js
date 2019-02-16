import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import DisplaySequence from './sequence/DisplaySequence';
import { playerService } from '../../../../infrastructure/services/PlayerService';
import { inject } from 'mobx-react';
import { appStorePropTypes } from '../../../../shared/store/AppStore';

@inject('appStore')
class StoryContent extends Component {
  state = {
    seqId: this.props.story.startSeq._id,
    player: false,
  };

  onOptionClick = async option => {
    this.setState({ seqId: option.nextSeq });
    const params = { ':playerId': this.state.player._id };
    playerService.setNextRouteParams(params);
    playerService.update(
      { lastStorySequence: option.nextSeq },
    );
  };

  getPlayer = async () => {
    const params = { ':story': this.props.story._id };
    playerService.setNextRouteParams(params);
    const player = await playerService.get(
      this.props.appStore.getUserId()
    );
    this.setState({ player });
  };

  componentDidMount () {
    this.getPlayer();
  }

  render() {
    const { story } = this.props;
    const { player, seqId } = this.state;

    if (!player) return '';

    return (
      <Fragment>
        <DisplaySequence
          story={story}
          seq={seqId}
          player={player}
          onOptionClick={this.onOptionClick}
        />
      </Fragment>
    );
  }
}

StoryContent.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,

  appStore: appStorePropTypes,
};

export default StoryContent;
