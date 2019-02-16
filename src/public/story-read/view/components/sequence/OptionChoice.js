import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { OptionModel } from '../../../../../infrastructure/models/OptionModel';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import styles from './DisplaySequence.module.scss';
import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import Typography from '@material-ui/core/Typography';

class OptionChoice extends Component {
  onOptionClick = hasInsufficient => () => {
    if (hasInsufficient.length) return;
    this.props.onOptionClick(this.props.option);
  };

  hasInsufficient = () => {
    const { option, player } = this.props;
    return option.consequences
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
  };

  renderLabel = hasInsufficient => {
    let label = this.props.option.action;
    if (hasInsufficient.length) {
      label += this.renderRequired(hasInsufficient);
    }

    return (
      <Typography
        variant="h6"
        color="inherit"
      >
        {label}
      </Typography>
    );
  };

  renderRequired = hasInsufficient => {
    return ' - required:' + hasInsufficient.map(resource => {
      return `${resource.attribute} ${-resource.needed}`;
    }).join(', ');

  };

  render() {
    const hasInsufficient = this.hasInsufficient();
    return (
      <Chip
        icon={<FaceIcon />}
        label={this.renderLabel(hasInsufficient)}
        onClick={this.onOptionClick(hasInsufficient)}
        className={styles.option}
        color={hasInsufficient.length ? 'default' : 'primary'}
        clickable={!hasInsufficient.length}
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
