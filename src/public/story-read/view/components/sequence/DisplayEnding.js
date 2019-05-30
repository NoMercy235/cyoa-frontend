import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import { Utils } from '@nomercy235/utils';

import { SequenceModel } from '../../../../../infrastructure/models/SequenceModel';

import styles from './DisplaySequence.module.scss';

class DisplayEnding extends Component {
  onHandleClick = () => this.props.onHandleClick();

  render() {
    if (!Utils.safeAccess(this.props.sequence, 'isEnding')) return '';
    return (
      <div className={styles.endingContainer}>
        <ListItem
          className={styles.option}
          onClick={this.onHandleClick}
        >
          <ListItemIcon>
            <FaceIcon color="primary" fontSize="large" />
          </ListItemIcon>
          <ListItemText primary="The end." />
        </ListItem>
      </div>
    );
  }
}

DisplayEnding.propTypes = {
  sequence: PropTypes.instanceOf(SequenceModel).isRequired,
  onHandleClick: PropTypes.func.isRequired,
};

export default DisplayEnding;
