import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Divider, Drawer, Typography } from '@material-ui/core';

import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';

import styles from './NodePreview.module.scss';

class NodePreview extends Component {
  render () {
    const { open, sequence = {}, onDrawerClose } = this.props;

    // TODO: retrieve the picture and show it

    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onDrawerClose}
      >
        <div className={styles.previewContainer}>
          <Typography variant="h6">
            {sequence.name}
          </Typography>
          <Divider className={styles.divider}/>
          <Typography>
            {sequence.content}
          </Typography>
        </div>
      </Drawer>
    );
  }
}

NodePreview.propTypes = {
  open: PropTypes.bool.isRequired,
  story: PropTypes.instanceOf(StoryModel),
  sequence: PropTypes.instanceOf(SequenceModel),

  onDrawerClose: PropTypes.func.isRequired,
};

export default NodePreview;
