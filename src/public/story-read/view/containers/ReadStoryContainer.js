import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { publicStoryService } from '../../../../infrastructure/services/StoryService';
import Breadcrumb from '../../../../shared/components/breadcrumb/Breadcrumb';
import { publicChapterService } from '../../../../infrastructure/services/ChapterService';
import { NOT_FOUND_ROUTE } from '../../../../shared/constants/routes';
import { playerService } from '../../../../infrastructure/services/PlayerService';
import { appStorePropTypes } from '../../../../shared/store/AppStore';
import DisplaySequence from '../components/sequence/DisplaySequence';
import { publicSequenceService } from '../../../../infrastructure/services/SequenceService';
import { getSeqById, getStoryStoreIdInIdb } from '../../../../shared/idb';
import { PlayerModel } from '../../../../infrastructure/models/PlayerModel';
import OfflineStoryUnavailable from '../components/OfflineStoryUnavailable';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import StoryFinished from '../components/story-finished/StoryFinished';

@inject('appStore')
@observer
class ReadStoryContainer extends Component {
  state = {
    canRender: false,
    isFinished: false,
    story: null,
    chapters: [],
    player: null,
    currentSequence: null,

    unavailableOffline: false,
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

  hasLost = async attributes => {
    // If an important attribute has a value below 0, the player lost and it should be
    // shown the linked ending of the attribute
    const negativeImportantAttr = attributes.find(a => a.isImportant && a.value <= 0);
    if (negativeImportantAttr) {
      await this.getSequence(negativeImportantAttr.linkedEnding);
      return negativeImportantAttr;
    }
  };

  onOptionClick = async option => {
    if (!option) {
      this.setState({ isFinished: true });
      return;
    }

    // If the story has offline mode available, the attributes should
    // be an empty array anyway.
    const attributes = this.getModifiedAttributes(option);
    const hasLostAttr = await this.hasLost(attributes);
    const metadata = {
      lastStorySequence: hasLostAttr
        ? hasLostAttr.linkedEnding
        : option.nextSeq,
      attributes,
    };

    const params = { ':playerId': this.state.player._id };
    playerService.setNextRouteParams(params);
    try {
      const player = await playerService.update(metadata);
      this.setState({ player });
    } catch (e) {
      // TODO: If this fails while the user is offline, do nothing, because it is expected
      // If it happens in other circumstances, an error notification should pop up
    }
    // If the player lost, there's no need to get a new sequence.
    // We already have the linked ending of the attribute
    if (hasLostAttr) return;
    await this.getSequence(option.nextSeq);
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
    const { appStore } = this.props;
    const { story } = this.state;
    const params = { ':story': story._id };
    publicSequenceService.setNextRouteParams(params);
    try {
      const sequence = await publicSequenceService.get(seqId);
      this.setState({ currentSequence: sequence });
    } catch (e) {
      if (!appStore.onlineStatus) {
        const offlineStoryStore = await this.getOfflineStoryStore();
        if (offlineStoryStore) {
          const sequence = await getSeqById(offlineStoryStore.story._id, seqId);
          this.setState({ currentSequence: sequence });
        } else {
          this.setState({ unavailableOffline: true });
        }
      }
    }
  };

  getOfflineStoryStore = async () => {
    const { match } = this.props;
    const storyId = match.params.storyId;
    return await getStoryStoreIdInIdb(storyId);
  };

  initOfflineStory = async offlineStoryStore => {
    const { story } = offlineStoryStore;
    const currentSequence = await getSeqById(story._id, story.startSeq);

    this.setState({
      canRender: true,
      story: new StoryModel(story),
      chapters: [],
      currentSequence,
      player: new PlayerModel(),
    });
  };

  async componentDidMount () {
    const { match, appStore } = this.props;

    const storyId = match.params.storyId;
    const offlineStoryStore = await this.getOfflineStoryStore();

    if (!appStore.onlineStatus && !offlineStoryStore) {
      this.setState({ unavailableOffline: true });
      return;
    } else if (!appStore.onlineStatus && offlineStoryStore) {
      await this.initOfflineStory(offlineStoryStore);
      return;
    }

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

  renderFinished = () => {
    const { player } = this.state;
    const { appStore: { onlineStatus } } = this.props;

    return (
      <StoryFinished
        player={player}
        onlineStatus={onlineStatus}
      />
    );
  };

  renderSequence = () => {
    const {
      story,
      chapters,
      player,
      currentSequence,
      isFinished,
      unavailableOffline,
    } = this.state;

    if (isFinished) {
      return this.renderFinished();
    }

    if (unavailableOffline) {
      return <OfflineStoryUnavailable/>;
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
