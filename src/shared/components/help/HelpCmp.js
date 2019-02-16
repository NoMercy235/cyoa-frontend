import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Help from '@material-ui/icons/Help';
import { withModal } from '../../hoc/withModal';
import HelpModal from './HelpModal';
import { styles } from './Help.css';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const HOCHelp = withModal(Help, HelpModal);

class HelpCmp extends Component {
  render() {
    const { text, textSize, title, description, classes } = this.props;

    return (
      <div className={classes.container}>
        <Typography
          variant={textSize || 'h6'}
          color="inherit"
        >
          {text}
        </Typography>
        <HOCHelp
          title={title}
          description={description}
          innerProps={{
            className: classes.helpBtn,
          }}
        />
      </div>
    );
  }
}

HelpCmp.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  textSize: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string, PropTypes.func, PropTypes.object,
  ]).isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string, PropTypes.func, PropTypes.object,
  ]).isRequired,
};

export default withStyles(styles, { withTheme: true })(HelpCmp);
