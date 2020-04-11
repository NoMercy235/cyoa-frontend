import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Button, Switch } from '@material-ui/core';
import withDisabledStoryPublished from '../../../../../../shared/hoc/withDisabledStoryPublished';

import styles from './ActionsToolbarComponent.module.scss';

const BtnWithDisabledState = withDisabledStoryPublished(Button);

class ActionsToolbarComponent extends Component {
  onAddNewSequenceModalOpen = () => {
    this.props.onAddNewSequenceModalOpen();
  };

  onAddNewOptionModalOpen = () => {
    this.props.onAddNewOptionModalOpen();
  };

  render () {
    const { isPreviewEnabled, onPreviewEnabledChange } = this.props;

    return (
      <div className={styles.toolbarContainer}>
        <BtnWithDisabledState
          className={styles.newSequenceBtn}
          onClick={this.onAddNewSequenceModalOpen}
          variant="outlined"
          color="primary"
        >
          New Sequence
        </BtnWithDisabledState>
        <BtnWithDisabledState
          onClick={this.onAddNewOptionModalOpen}
          variant="outlined"
          color="primary"
        >
          New Option
        </BtnWithDisabledState>
        <div className={styles.divider}/>
        <div>
          Allow preview?
          <Switch
            value={isPreviewEnabled}
            checked={isPreviewEnabled}
            onChange={onPreviewEnabledChange}
          />
        </div>
      </div>
    );
  }
}

ActionsToolbarComponent.propTypes = {
  isPreviewEnabled: PropTypes.bool.isRequired,

  onPreviewEnabledChange: PropTypes.func.isRequired,
  onAddNewSequenceModalOpen: PropTypes.func.isRequired,
  onAddNewOptionModalOpen: PropTypes.func.isRequired,
};

export default ActionsToolbarComponent;
