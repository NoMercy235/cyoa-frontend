import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';

import { OptionModel } from '../../../../../infrastructure/models/OptionModel';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';

import styles from './DisplaySequence.module.scss';

class OptionChoice extends Component {
  onOptionClick = () => {
    const { option, onOptionClick } = this.props;
    onOptionClick(option);
  };

  // This is not needed for now, but it might be in the future
  // so it will be left here
  hasInsufficient = () => {
    const { option, player } = this.props;
    const needed = option.consequences
      .map(c => {
        const playerAttr = player.attributes.find(a => {
          return a.name === c.attribute;
        });
        if (playerAttr.isImportant) return false;
        return {
          attribute: c.attribute,
          needed: playerAttr.value + c.changeValue,
        };
      })
      .filter(c => {
        return c && c.needed < 0;
      });
    return !!needed.length;
  };

  render() {
    const {
      option: {
        action: label,
      },
    } = this.props;

    return (
      <ListItem
        className={styles.option}
        onClick={this.onOptionClick}
      >
        <ListItemIcon>
          <FaceIcon color="primary" fontSize="large" />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItem>
    );
  }
}

OptionChoice.propTypes = {
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  option: PropTypes.instanceOf(OptionModel).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default OptionChoice;
