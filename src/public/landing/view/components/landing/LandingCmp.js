import React, { Component } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import StoryBox from '../story-box/StoryBox';
import styles from './LandingCmp.module.scss';

@observer
class LandingCmp extends Component {
  render() {
    const { stories } = this.props;

    return (
      <div className={styles.storiesContainer}>
        {!!stories.length && stories.map(s => (
          <StoryBox key={s._id} story={s}/>
        ))}
      </div>
    );
  }
}

LandingCmp.propTypes = {
  stories: PropTypes.arrayOf(PropTypes.instanceOf(StoryModel)),
};

export default LandingCmp;
