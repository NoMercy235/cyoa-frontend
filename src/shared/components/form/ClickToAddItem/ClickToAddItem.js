import React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { ExpansionPanel, ExpansionPanelSummary } from '@material-ui/core';

import styles from './ClickToAddItem.module.scss';

const ClickToAddItem = ({ className, label, onClick }) => {
  return (
    <ExpansionPanel
      disabled={true}
      onClick={onClick}
      className={classNames(styles.addNewItemPanel, className)}
    >
      <ExpansionPanelSummary>
        {label}
      </ExpansionPanelSummary>
    </ExpansionPanel>
  );
};

ClickToAddItem.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ClickToAddItem;
