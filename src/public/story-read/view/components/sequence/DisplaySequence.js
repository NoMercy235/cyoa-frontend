import React, { Component, Fragment } from 'react';
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

class DisplaySequence extends Component {
  state = { sequence: null };

  renderTitle = () => {
    const { sequence } = this.state;
    const { player } = this.props;

    return (
      <Fragment>
        <span>{sequence.name}&nbsp;-&nbsp;</span>
        {player.attributes.map((a, i) => (
          <small key={i}>
            {a.name}:&nbsp;{a.value}&nbsp;
          </small>
        ))}
      </Fragment>
    );
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
    const { onOptionClick } = this.props;

    return (
      <Card>
        <CardHeader title={this.renderTitle()}/>
        <CardContent>
          {sequence.content}
        </CardContent>
        <CardActions disableActionSpacing>
          <div className={styles.optionContainer}>
            {sequence.options.map(o => (
              <OptionChoice
                key={o._id}
                option={o}
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
  story: PropTypes.shape(StoryModel).isRequired,
  seq: PropTypes.string.isRequired,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default DisplaySequence;
