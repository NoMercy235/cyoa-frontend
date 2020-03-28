import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import styles from './ActionsToolbarComponent.module.scss';

class ActionsToolbarComponent extends Component {
  onAddNewSequenceModalOpen = () => {
    this.props.onAddNewSequenceModalOpen();
  };

  onAddNewOptionModalOpen = () => {
    this.props.onAddNewOptionModalOpen();
  };

  render () {
    return (
      <div className={styles.toolbarContainer}>
        <Button
          className={styles.newSequenceBtn}
          onClick={this.onAddNewSequenceModalOpen}
          variant="outlined"
          color="primary"
        >
          New Sequence
        </Button>
        <Button
          onClick={this.onAddNewOptionModalOpen}
          variant="outlined"
          color="primary"
        >
          New Option
        </Button>
        <div className={styles.divider}/>
      </div>
    );
  }
}

ActionsToolbarComponent.propTypes = {
  onAddNewSequenceModalOpen: PropTypes.func.isRequired,
  onAddNewOptionModalOpen: PropTypes.func.isRequired,
};

export default ActionsToolbarComponent;
