import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { OptionModel } from '../../../../../infrastructure/models/OptionModel';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import styles from './DisplaySequence.module.scss';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import Typography from '@material-ui/core/Typography';

class OptionChoice extends Component {
  onOptionClick = () => {
    this.props.onOptionClick(this.props.option);
  };

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

  renderLabel = () => {
    let label = this.props.option.action;

    return (
      <Typography
        variant="h6"
        color="inherit"
      >
        {label}
      </Typography>
    );
  };

  render() {
    if(this.hasInsufficient()) return null;

    return (
      <Chip
        icon={<FaceIcon />}
        label={this.renderLabel()}
        onClick={this.onOptionClick}
        className={styles.option}
        color="primary"
      />
    );
  }
}

OptionChoice.propTypes = {
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  option: PropTypes.instanceOf(OptionModel).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default OptionChoice;
