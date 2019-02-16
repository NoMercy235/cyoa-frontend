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
import { Utils } from '@nomercy235/utils';
import Button from '@material-ui/core/Button';
import { LANDING_ROUTE } from '../../../../../shared/constants/routes';

class DisplaySequence extends Component {
  state = { sequence: null };

  getSequence = async () => {
    const { story, seq } = this.props;
    const params = { ':story': story._id };
    publicSequenceService.setNextRouteParams(params);
    const sequence = await publicSequenceService.get(seq);
    this.setState({ sequence });
  };

  goToHome = () => {
    this.props.history.push(LANDING_ROUTE);
  };

  renderEnding = () => {
    if (!Utils.safeAccess(this.state.sequence, 'isEnding')) return '';
    return (
      <div className={styles.endingContainer}>
        This is the end. Congrats!
        <Button
          color="secondary"
          onClick={this.goToHome}
        >
          Go back
        </Button>
      </div>
    );
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
        <CardHeader title={sequence.name}/>
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
        {this.renderEnding()}
      </Card>
    );
  }
}

DisplaySequence.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
  seq: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default DisplaySequence;
