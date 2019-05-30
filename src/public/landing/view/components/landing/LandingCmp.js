import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import StoryBox from '../story-box/StoryBox';
import NoResultsFound from '../../../../../shared/components/table/NoResultsFound';

import styles from './LandingCmp.module.scss';

@observer
class LandingCmp extends Component {
  hasStories = () => !!this.props.stories.length;

  render() {
    const { stories } = this.props;

    return (
      <div className={styles.storiesContainer}>
        <NoResultsFound condition={!this.hasStories()}/>
        {this.hasStories() && stories.map(s => (
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
