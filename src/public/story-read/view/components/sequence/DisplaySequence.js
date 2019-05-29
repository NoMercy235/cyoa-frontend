import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import OptionChoice from './OptionChoice';
import styles from './DisplaySequence.module.scss';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import DisplayEnding from './DisplayEnding';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import DisplaySequenceTitle from './DisplaySequenceTitle';
import { parseContent } from '../../../../../shared/utilities';
import { ChapterModel } from '../../../../../infrastructure/models/ChapterModel';
import List from '@material-ui/core/List';
import RootRef from '@material-ui/core/RootRef';
import { SequenceModel } from '../../../../../infrastructure/models/SequenceModel';

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
    const { seq } = this.props;
    return seq.scenePic && (
      <img
        className={styles.scenePic}
        src={seq.scenePic}
        alt=""
      />
    );
  };

  renderContent = () => {
    return parseContent(this.props.seq.content);
  };

  async componentDidUpdate () {
    this.scrollToCardTop();
  }

  render() {
    const { onOptionClick, player, seq } = this.props;

    return (
      <RootRef rootRef={this.cardRef}>
        <Card classes={{ root: styles.card }}>
          <CardHeader title={this.renderTitle()}/>
          <CardContent>
            {this.renderPicture()}
            {this.renderContent()}
          </CardContent>
          <CardActions disableActionSpacing>
            <List className={styles.optionsContainer}>
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
  onOptionClick: PropTypes.func.isRequired,
};

export default DisplaySequence;
