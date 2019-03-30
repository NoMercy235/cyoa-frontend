import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import DisplaySequence from './sequence/DisplaySequence';
import { playerService } from '../../../../infrastructure/services/PlayerService';
import { inject } from 'mobx-react';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import EndingContainer from '../containers/EndingContainer';

@inject('appStore')
class StoryContent extends Component {
  state = {
    seqId: '',
    player: false,
    hasWon: false,
  };

  getModifiedAttributes = option => {
    return this.state.player.attributes
      .map(attr => {
        const consequence = option.consequences.find(c => {
          return c.attribute === attr.name;
        });
        if (consequence) {
          attr.value += consequence.changeValue;
        }
        return attr;
      });
  };

  onOptionClick = async option => {
    if (!option) {
      this.setState({ hasWon: true });
      return;
    }

    const attributes = this.getModifiedAttributes(option);

    const params = { ':playerId': this.state.player._id };
    playerService.setNextRouteParams(params);
    const player = await playerService.update(
      {
        lastStorySequence: option.nextSeq,
        attributes,
      },
    );
    this.setState({
      player,
      seqId: option.nextSeq,
    });
  };

  getPlayer = async () => {
    const params = { ':story': this.props.story._id };
    playerService.setNextRouteParams(params);
    const player = await playerService.get(
      this.props.appStore.getUserId()
    );
    this.setState({
      player,
      seqId: player.lastStorySequence,
    });
  };

  componentDidMount () {
    this.getPlayer();
  }

  render() {
    const { story } = this.props;
    const { player, seqId } = this.state;

    if (!player) return '';
    const hasWon = this.state.hasWon;
    if (hasWon) {
      return <EndingContainer
        story={story}
        player={player}
        hasWon={hasWon}
      />;
    }

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
