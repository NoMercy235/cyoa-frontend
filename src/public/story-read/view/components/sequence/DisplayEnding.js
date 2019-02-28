import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import styles from './DisplaySequence.module.scss';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import { SequenceModel } from '../../../../../infrastructure/models/SequenceModel';
import { Utils } from '@nomercy235/utils';

class DisplayEnding extends Component {
  onHandleClick = () => this.props.onHandleClick();

  render() {
    if (!Utils.safeAccess(this.props.sequence, 'isEnding')) return '';
    return (
      <div className={styles.endingContainer}>
        <Chip
          icon={<FaceIcon />}
          label=" This end."
          onClick={this.onHandleClick}
        />
      </div>
    );
  }
}

DisplayEnding.propTypes = {
  sequence: PropTypes.instanceOf(SequenceModel).isRequired,
  onHandleClick: PropTypes.func.isRequired,
};

export default DisplayEnding;
