import React, { Component } from 'react';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import * as PropTypes from 'prop-types';

class BasicReorderAction extends Component {
  // Checking one more time to really prevent the user from updating the position
  onMoveUp = () => {
    !this.props.disableUp && this.props.onMoveUp();
  };

  onMoveDown = () => {
    !this.props.disableDown && this.props.onMoveDown();
  };

  render() {
    const { disableUp, disableDown } = this.props;

    // The extra divs are needed because Tooltip does not allow having disabled children
    return (
      <>
        <Tooltip title="Move up">
          <div>
            <IconButton
              disabled={disableUp}
              onClick={this.onMoveUp}
            >
              <ArrowUpIcon fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>

        <Tooltip title="Move down">
          <div>
            <IconButton
              disabled={disableDown}
              onClick={this.onMoveDown}
            >
              <ArrowDownIcon fontSize="small" />
            </IconButton>
          </div>
        </Tooltip>
      </>
    );
  }
}

BasicReorderAction.propTypes = {
  disableUp: PropTypes.bool.isRequired,
  disableDown: PropTypes.bool.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
};

export default BasicReorderAction;
