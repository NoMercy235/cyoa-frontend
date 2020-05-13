import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";
import * as queryString from 'query-string';

import { publicStoryService, storyService } from '../../../../infrastructure/services/StoryService';
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
import ConfirmationModal from '../../../../shared/components/confirmation/ConfirmationModal';
import StoryRating from '../components/story-rating/StoryRating';
import { ratingService } from '../../../../infrastructure/services/RatingService';
import LoadingCmp from '../../../../shared/components/loading/LoadingCmp';

@inject('appStore')
@observer
class ReadStoryContainer extends Component {
  state = {
    canRender: false,
    isFinished: false,
    showLoading: false,
    story: null,
    chapters: [],
    player: null,
    currentSequence: null,
    currentRating: undefined,

    unavailableOffline: false,
  };

  goTo404 = () => {
    const { history } = this.props;
    history.replace(NOT_FOUND_ROUTE);
  };

  getPlayer = async storyId => {
    const params = { ':story': storyId };
    playerService.setNextRouteParams(params);
    return await playerService.get(
      this.props.appStore.getUserId()
    );
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
    this.setState({ showLoading: true });

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
    if (hasLostAttr) {
      this.setState({ showLoading: false });
      return;
    }
    await this.getSequence(option.nextSeq);
    this.setState({ showLoading: false });
  };

  getStory = async storyId => {
    const { location: { search } } = this.props;
    const qs = queryString.parse(search);
    const options = { ignoreFields: 'coverPic' };
    if (qs.isPreview === 'true') {
      return await storyService.get(storyId, {
        ...options,
        isPreview: true,
      });
    }
    return await publicStoryService.get(storyId, options);
  };

  getChapters = async storyId => {
    const params = { ':story': storyId };
    publicChapterService.setNextRouteParams(params);
    return await publicChapterService.list({});
  };

  getSequence = async (seqId, storyId = this.state.story._id ) => {
    const { appStore } = this.props;
    const params = { ':story': storyId };
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

  onKeepPlayerAccept = async () => {
    const { appStore, match } = this.props;
    const { player } = this.state;

    const params = {
      ':player': appStore.getUserId(),
      ':story': match.params.storyId,
    };
    playerService.setNextRouteParams(params);
    const newPlayer = await playerService.set({
      lastStorySequence: player.lastStorySequence,
      attributes: player.attributes,
    });
    appStore.isKeepPlayerModalOpen = false;
    this.setState({ player: newPlayer });
  };

  onKeepPlayerReject = async () => {
    const { appStore, match } = this.props;
    const storyId = match.params.storyId;

    const player = await this.getPlayer(storyId);
    await this.getSequence(player.lastStorySequence, storyId);
    this.setState({ player });
    appStore.isKeepPlayerModalOpen = false;
  };

  onInitStoryRating = async () => {
    const {
      match,
      appStore: { getUserId }
    } = this.props;

    const storyId = match.params.storyId;

    const rating = await ratingService.get(getUserId(), storyId);
    this.setState({ currentRating: rating });
  };

  onStoryRatingChange = async (rating) => {
    const { story } = this.state;
    const { appStore: { getUserId } } = this.props;
    await ratingService.update(getUserId(), story._id, rating);
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
      const [story, chapters, player] = await Promise.all([
        this.getStory(storyId),
        this.getChapters(storyId),
        this.getPlayer(storyId),
      ]);
      await this.getSequence(player.lastStorySequence, storyId);
      this.setState({
        canRender: true,
        story,
        chapters,
        player,
      });
    } catch (e) {
      console.log(e);
      // TODO: It's not always a 404. Handle different cases as well.
      this.goTo404();
    }
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

  renderStoryRating = () => {
    const { player, story, currentRating = { rating: 0 } } = this.state;

    return (
      <StoryRating
        initialValue={currentRating.rating}
        player={player}
        story={story}
        onInit={this.onInitStoryRating}
        onChange={this.onStoryRatingChange}
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
      showLoading,
    } = this.state;
    const { appStore: { isLoggedIn } } = this.props;

    if (isFinished) {
      return (
        <>
          {this.renderFinished()}
          {isLoggedIn && this.renderStoryRating()}
        </>
      );
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
        showLoading={showLoading}
        onOptionClick={this.onOptionClick}
      />
    );
  };

  renderKeepPlayerModal = () => {
    const { appStore } = this.props;

    const text = appStore.isLoggedIn
      ? 'If you keep the current player, it will replace your cloud save, if any. Otherwise, your current progress will be replaced by the cloud save.'
      : 'You can keep the current player or discard it to load the local one';

    return (
      <ConfirmationModal
        title="Keep current player?"
        description={text}
        open={appStore.isKeepPlayerModalOpen}
        onAccept={this.onKeepPlayerAccept}
        onClose={this.onKeepPlayerReject}
      />
    );
  };

  render() {
    const { canRender, story }  = this.state;

    if (!canRender) return <LoadingCmp/>;

    return (
      <>
        <Helmet>
          <title>Rigamo | {story.name}</title>
        </Helmet>
        <Breadcrumb/>
        {this.renderSequence()}
        {this.renderKeepPlayerModal()}
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
