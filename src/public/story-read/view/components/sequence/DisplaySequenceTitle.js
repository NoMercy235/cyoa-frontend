import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import { SequenceModel } from '../../../../../infrastructure/models/SequenceModel';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import ToysIcon from '@material-ui/icons/Toys';
import styles from './DisplaySequence.module.scss';
import { ChapterModel } from '../../../../../infrastructure/models/ChapterModel';

class DisplaySequenceTitle extends Component {
  renderChapterName = () => {
    const { sequence, chapters } = this.props;
    if (!sequence.chapter) return null;
    const chapter = chapters.find(c => c._id === sequence.chapter);
    return (
      <span>{chapter.name}&nbsp;-&nbsp;</span>
    );
  };

  renderAttribute = (attr, index) => {
    const text = (
      <Fragment>
        <b>{attr.name}</b>&nbsp;&nbsp;{attr.value}
      </Fragment>
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
      <Fragment>
        {this.renderChapterName()}
        {player.attributes.map(this.renderAttribute)}
      </Fragment>
    );
  }
}

DisplaySequenceTitle.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.instanceOf(ChapterModel)).isRequired,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  sequence: PropTypes.instanceOf(SequenceModel).isRequired,
};

export default DisplaySequenceTitle;
