import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import { SequenceModel } from '../../../../infrastructure/models/SequenceModel';
import OptionChoice from './OptionChoice';
import styles from './ReadStory.module.scss';

class DisplaySequence extends Component {
  render() {
    const { seq } = this.props;

    return (
      <Card>
        <CardHeader title={seq.name}/>
        <CardContent>
          {seq.content}
        </CardContent>
        <CardActions disableActionSpacing>
          <div className={styles.optionContainer}>
            {seq.options.map(o => (
              <OptionChoice key={o._id} option={o}/>
            ))}
          </div>
        </CardActions>
      </Card>
    );
  }
}

DisplaySequence.propTypes = {
  seq: PropTypes.shape(SequenceModel),
};

export default DisplaySequence;
