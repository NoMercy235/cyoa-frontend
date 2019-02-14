import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import StoryBox from './StoryBox/StoryBox';
import classes from '../../style/LandingCmp.module.scss';

@observer
class LandingCmp extends Component {
  render() {
    const { stories } = this.props;
    return (
      <Fragment>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
        >
          Latest stories:
        </Typography>
        <div className={classes.storiesContainer}>
          {!!stories.length && stories.map(s => (
            <StoryBox key={s._id} story={s}/>
          ))}
        </div>
      </Fragment>
    );
  }
}

LandingCmp.propTypes = {
  stories: PropTypes.arrayOf(PropTypes.shape(StoryModel)),
};

export default LandingCmp;
