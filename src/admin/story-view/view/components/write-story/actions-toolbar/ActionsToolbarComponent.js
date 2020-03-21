import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import styles from './ActionsToolbarComponent.module.scss';

class ActionsToolbarComponent extends Component {
  render () {
    const { onAddNewSequenceModalOpen, onSaveStory } = this.props;
    return (
      <div className={styles.toolbarContainer}>
        <Button
          onClick={onAddNewSequenceModalOpen}
          variant="outlined"
          color="primary"
        >
          New Sequence
        </Button>
        <div className={styles.divider}/>
        <Button
          onClick={onSaveStory}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </div>
    );
  }
}

ActionsToolbarComponent.propTypes = {
  onAddNewSequenceModalOpen: PropTypes.func.isRequired,
  onSaveStory: PropTypes.func.isRequired,
};

export default ActionsToolbarComponent;
