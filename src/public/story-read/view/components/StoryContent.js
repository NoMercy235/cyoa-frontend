import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import DisplaySequence from './sequence/DisplaySequence';
import { playerService } from '../../../../infrastructure/services/PlayerService';
import { inject } from 'mobx-react';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import { withRouter } from 'react-router-dom';
import { makePath, STORY_ENDING_ROUTE } from '../../../../shared/constants/routes';

@inject('appStore')
class StoryContent extends Component {
  state = {
    seqId: this.props.story.startSeq._id,
    player: false,
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

  checkPlayerIsDead = player => {
    const isDead = player.attributes.filter(attr => {
      if (!attr.isImportant) return false;
      if (attr.value <= 0) return true;
    });

    if (isDead.length) {
      this.props.history.push(
        makePath(STORY_ENDING_ROUTE,
          { ':storyId': this.props.story._id }),
      );
      return true;
    }
  };

  onOptionClick = async option => {
    const attributes = this.getModifiedAttributes(option);

    const params = { ':playerId': this.state.player._id };
    playerService.setNextRouteParams(params);
    const player = await playerService.update(
      {
        lastStorySequence: option.nextSeq,
        attributes,
      },
    );
    if (this.checkPlayerIsDead(player)) return;
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
    if (this.checkPlayerIsDead(player)) return;
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
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  appStore: appStorePropTypes,
};

export default withRouter(StoryContent);
