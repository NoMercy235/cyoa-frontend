import React, { Component } from 'react';
import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import { withRouter } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { publicChapterService } from '../../../../infrastructure/services/ChapterService';
import { NOT_FOUND_ROUTE } from '../../../../shared/constants/routes';
import { playerService } from '../../../../infrastructure/services/PlayerService';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import DisplaySequence from '../components/sequence/DisplaySequence';
import EndingContainer from './EndingContainer';
import { publicSequenceService } from '../../../../infrastructure/services/SequenceService';

@inject('appStore')
@observer
class ReadStoryContainer extends Component {
  state = {
    canRender: false,
    hasWon: false,
    story: null,
    chapters: [],
    player: null,
    currentSequence: null,
  };

  goTo404 = () => {
    const { history } = this.props;
    history.replace(NOT_FOUND_ROUTE);
  };

  getPlayer = async () => {
    const params = { ':story': this.state.story._id };
    playerService.setNextRouteParams(params);
    const player = await playerService.get(
      this.props.appStore.getUserId()
    );
    this.setState({ player });
    return player;
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
    const metadata = {
      lastStorySequence: option.nextSeq,
      attributes,
    };

    const params = { ':playerId': this.state.player._id };
    playerService.setNextRouteParams(params);
    const player = await playerService.update(metadata);
    const sequence = await this.getSequence(option.nextSeq);
    this.setState({ player, sequence });
  };

  getStory = async storyId => {
    const options = { ignoreFields: 'coverPic' };
    const story = await publicStoryService.get(storyId, options);
    this.setState({ story });
  };

  getChapters = async storyId => {
    const params = { ':story': storyId };
    publicChapterService.setNextRouteParams(params);
    const chapters = await publicChapterService.list({});
    this.setState({ chapters });
  };

  getSequence = async seqId => {
    const { story } = this.state;
    const params = { ':story': story._id };
    publicSequenceService.setNextRouteParams(params);
    const sequence = await publicSequenceService.get(seqId);
    this.setState({ currentSequence: sequence });
  };

  async componentDidMount () {
    const storyId = this.props.match.params.storyId;

    try {
      await Promise.all([
        this.getStory(storyId),
        this.getChapters(storyId),
      ]);
      const player = await this.getPlayer();
      await this.getSequence(player.lastStorySequence);
    } catch (e) {
      // TODO: It's not always a 404. Handle different cases as well.
      this.goTo404();
    }
    this.setState({ canRender: true });
  }

  renderSequence = () => {
    const {
      story,
      chapters,
      player,
      currentSequence,
      hasWon,
    } = this.state;

    if (hasWon) {
      return (
        <EndingContainer
          story={story}
          player={player}
          hasWon={hasWon}
        />
      );
    }

    return (
      <DisplaySequence
        story={story}
        chapters={chapters}
        seq={currentSequence}
        player={player}
        onOptionClick={this.onOptionClick}
      />
    );
  };

  render() {
    const { canRender } = this.state;

    return (
      <>
        <Breadcrumb/>
        {canRender && this.renderSequence()}
      </>
    );
  }
}

ReadStoryContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  appStore: appStorePropTypes,
};

export default withRouter(ReadStoryContainer);
