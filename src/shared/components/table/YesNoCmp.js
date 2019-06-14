import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

class YesNoCmp extends Component {
  render() {
    const { condition } = this.props;
    return condition
      ? <CheckIcon color="primary"/>
      : <CloseIcon color="secondary"/>;
  }
}

YesNoCmp.propTypes = {
  condition: PropTypes.bool.isRequired,
};

export default YesNoCmp;
