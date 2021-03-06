import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Avatar, Chip } from '@material-ui/core';
import ToysIcon from '@material-ui/icons/Toys';

import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import { SequenceModel } from '../../../../../infrastructure/models/SequenceModel';
import { ChapterModel } from '../../../../../infrastructure/models/ChapterModel';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';

import styles from './DisplaySequence.module.scss';

class DisplaySequenceTitle extends Component {
  renderChapterName = () => {
    const { sequence, chapters, story } = this.props;
    const displayName = sequence.chapter
      ? chapters.find(c => c._id === sequence.chapter).name
      : story.name;
    return (
      <span className={styles.displayName}>
        {displayName}
      </span>
    );
  };

  renderAttribute = (attr, index) => {
    const text = (
      <>
        <b>{attr.name}</b>&nbsp;&nbsp;{attr.value}
      </>
    );

    return (
      <Chip
        key={index}
        avatar={
          <Avatar>
            <ToysIcon/>
          </Avatar>
        }
        label={text}
        className={styles.chip}
        color="primary"
        variant="outlined"
      />
    );
  };

  render() {
    const { sequence, player } = this.props;
    if (!sequence) return '';

    return (
      <div className={styles.titleContainer}>
        {this.renderChapterName()}
        <div className={styles.attributesContainer}>
          {player.attributes.map(this.renderAttribute)}
        </div>
      </div>
    );
  }
}

DisplaySequenceTitle.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.instanceOf(ChapterModel)).isRequired,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  sequence: PropTypes.instanceOf(SequenceModel).isRequired,
  story: PropTypes.instanceOf(StoryModel).isRequired,
};

export default DisplaySequenceTitle;
