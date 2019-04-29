import React, { Component } from 'react';
import { observer } from 'mobx-react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import StoryBox from '../story-box/StoryBox';
import styles from './LandingCmp.module.scss';
import NoResultsFound from '../../../../../shared/components/table/NoResultsFound';

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
