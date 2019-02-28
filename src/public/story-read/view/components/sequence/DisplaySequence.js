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

class DisplaySequence extends Component {
  state = { sequence: null };

  renderTitle = () => {
    const { sequence } = this.state;
    const { player } = this.props;

    return (
      <DisplaySequenceTitle
        player={player}
        sequence={sequence}
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

  componentDidUpdate () {
    if (this.props.seq !== this.state.sequence._id) {
      this.getSequence();
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
      <Card>
        <CardHeader title={this.renderTitle()}/>
        <CardContent>
          {this.renderPicture()}
          {this.renderContent()}
        </CardContent>
        <CardActions disableActionSpacing>
          <div className={styles.optionContainer}>
            {sequence.options.map(o => (
              <OptionChoice
                key={o._id}
                option={o}
                player={player}
                onOptionClick={onOptionClick}
              />
            ))}
          </div>
        </CardActions>
        <DisplayEnding
          sequence={sequence}
          onHandleClick={onOptionClick}
        />
      </Card>
    );
  }
}

DisplaySequence.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  seq: PropTypes.string.isRequired,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default DisplaySequence;
