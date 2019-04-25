import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import OptionChoice from './OptionChoice';
import styles from './DisplaySequence.module.scss';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { publicSequenceService } from '../../../../../infrastructure/services/SequenceService';
import DisplayEnding from './DisplayEnding';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import DisplaySequenceTitle from './DisplaySequenceTitle';
import { parseContent } from '../../../../../shared/utilities';
import { ChapterModel } from '../../../../../infrastructure/models/ChapterModel';
import List from '@material-ui/core/List';
import RootRef from '@material-ui/core/RootRef';

class DisplaySequence extends Component {
  state = { sequence: null };
  cardRef = React.createRef();

  scrollToCardTop = () => {
    console.log(this.cardRef);
    this.cardRef.current.scrollTop = 0;
  };

  renderTitle = () => {
    const { sequence } = this.state;
    const { chapters, player, story } = this.props;

    return (
      <DisplaySequenceTitle
        player={player}
        sequence={sequence}
        chapters={chapters}
        story={story}
      />
    );
  };

  renderPicture = () => {
    const { sequence } = this.state;
    if (!sequence.scenePic) return '';
    return (
      <img
        className={styles.scenePic}
        src={sequence.scenePic}
        alt=""
      />
    );
  };

  renderContent = () => {
    return parseContent(this.state.sequence.content);
  };

  getSequence = async () => {
    const { story, seq } = this.props;
    const params = { ':story': story._id };
    publicSequenceService.setNextRouteParams(params);
    const sequence = await publicSequenceService.get(seq);
    this.setState({ sequence });
  };

  async componentDidUpdate () {
    if (this.props.seq !== this.state.sequence._id) {
      await this.getSequence();
      this.scrollToCardTop();
    }
  }

  componentDidMount () {
    this.getSequence();
  }

  render() {
    const { sequence } = this.state;
    if (!sequence) return '';
    const { onOptionClick, player } = this.props;

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
              {!sequence.isEnding && sequence.options.map(o => (
                <OptionChoice
                  key={o._id}
                  option={o}
                  player={player}
                  onOptionClick={onOptionClick}
                />
              ))}
              {sequence.isEnding && (
                <DisplayEnding
                  sequence={sequence}
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
  seq: PropTypes.string.isRequired,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default DisplaySequence;
