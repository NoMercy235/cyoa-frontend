import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Help from '@material-ui/icons/Help';
import { withModal } from '../../hoc/withModal';
import HelpModal from './HelpModal';
import { styles } from './Help.css';
import { withStyles } from '@material-ui/core/styles';

const HOCHelp = withModal(Help, HelpModal);

class HelpCmp extends Component {
  render() {
    return (
      <HOCHelp
        title={this.props.title}
        description={this.props.description}
        innerProps={{
          className: this.props.classes.helpBtn,
        }}
      />
    );
  }
}

HelpCmp.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string, PropTypes.func, PropTypes.object,
  ]).isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string, PropTypes.func, PropTypes.object,
  ]).isRequired,
};

export default withStyles(styles, { withTheme: true })(HelpCmp);
