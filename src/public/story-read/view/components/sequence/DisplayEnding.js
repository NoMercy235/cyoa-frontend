import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import styles from './DisplaySequence.module.scss';
import { LANDING_ROUTE } from '../../../../../shared/constants/routes';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import { SequenceModel } from '../../../../../infrastructure/models/SequenceModel';
import { withRouter } from 'react-router-dom';
import { Utils } from '@nomercy235/utils';

class DisplayEnding extends Component {
  goToHome = () => {
    this.props.history.push(LANDING_ROUTE);
  };

  render() {
    if (!Utils.safeAccess(this.props.sequence, 'isEnding')) return '';
    return (
      <div className={styles.endingContainer}>
        <Chip
          icon={<FaceIcon />}
          label=" This is the end. Congrats! Click here to go read other stories"
          onClick={this.goToHome}
        />
      </div>
    );
  }
}

DisplayEnding.propTypes = {
  sequence: PropTypes.shape(SequenceModel).isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(DisplayEnding);
