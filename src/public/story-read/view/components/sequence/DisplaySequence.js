import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  List,
  RootRef,
} from '@material-ui/core';
import classNames from 'classnames';

import OptionChoice from './OptionChoice';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import DisplayEnding from './DisplayEnding';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import DisplaySequenceTitle from './DisplaySequenceTitle';
import { parseContent } from '../../../../../shared/utilities';
import { ChapterModel } from '../../../../../infrastructure/models/ChapterModel';
import { SequenceModel } from '../../../../../infrastructure/models/SequenceModel';
import LoadingCmp from '../../../../../shared/components/loading/LoadingCmp';
import TextWithImage from '../../../../../shared/components/text-with-image/TextWithImage';
import { SEQUENCE_PICTURE_CROPPER_SIZE } from '../../../../../shared/constants/sequences';

import styles from './DisplaySequence.module.scss';

class DisplaySequence extends Component {
  cardRef = React.createRef();

  scrollToCardTop = () => {
    this.cardRef.current.scrollTop = 0;
  };

  renderTitle = () => {
    const { chapters, player, story, seq } = this.props;

    return (
      <DisplaySequenceTitle
        player={player}
        sequence={seq}
        chapters={chapters}
        story={story}
      />
    );
  };

  renderPicture = () => {
    const { seq, story } = this.props;
    return seq.scenePic && (
      <img
        className={styles.scenePic}
        src={seq.scenePic}
        alt={story.name}
      />
    );
  };

  componentDidUpdate () {
    this.scrollToCardTop();
  }

  renderSequence = () => {
    const { onOptionClick, player, seq } = this.props;

    return (
        <>
          <CardHeader title={this.renderTitle()}/>
          <CardContent>
            <TextWithImage
              image={seq.scenePic}
              size={SEQUENCE_PICTURE_CROPPER_SIZE}
              text={parseContent(seq.content)}
            />
            <Divider/>
          </CardContent>
          <CardActions disableSpacing>
            <List className={classNames(styles.optionsContainer, styles.optionsContainerEnforcer)}>
              {!seq.isEnding && seq.options.map(o => (
                <OptionChoice
                  key={o._id}
                  option={o}
                  player={player}
                  onOptionClick={onOptionClick}
                />
              ))}
              {seq.isEnding && (
                <DisplayEnding
                  sequence={seq}
                  onHandleClick={onOptionClick}
                />
              )}
            </List>
          </CardActions>
        </>
      );
  };

  render() {
    const { showLoading } = this.props;

    return (
      <RootRef rootRef={this.cardRef}>
        <Card classes={{ root: styles.card }}>
          {showLoading
            ? <LoadingCmp className={styles.loadingContainer}/>
            : this.renderSequence()
          }
        </Card>
      </RootRef>
    );
  }
}

DisplaySequence.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  chapters: PropTypes.arrayOf(PropTypes.instanceOf(ChapterModel)).isRequired,
  seq: PropTypes.instanceOf(SequenceModel).isRequired,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  showLoading: PropTypes.bool.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default DisplaySequence;
