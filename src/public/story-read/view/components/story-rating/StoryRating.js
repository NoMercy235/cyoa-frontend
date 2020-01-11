import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';

import { PlayerModel } from '../../../../../infrastructure/models/PlayerModel';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import Rating from '../../../../../shared/components/rating/Rating';
import { STORY_RATING_LABELS } from '../../../../../shared/constants/global';
import LoadingCmp from '../../../../../shared/components/loading/LoadingCmp';

class StoryRating extends Component {
  state = {
    shouldShowLoading: true,
    isDisabled: false,
  };

  async componentDidMount () {
    const { onInit } = this.props;
    try {
      onInit && await onInit();
    } catch (e) {
      // No rating for the user
    } finally {
      this.setState({ shouldShowLoading: false })
    }
  }

  getTitle = () => {
    return (
      <Typography
        variant="h4"
        color="inherit"
      >
        Give a rating?
      </Typography>
    );
  };

  onChange = async (value) => {
    this.setState({ isDisabled: true });
    await this.props.onChange(value);
    this.setState({ isDisabled: false });
  };

  getContentText = () => {
    const { initialValue } = this.props;
    const { shouldShowLoading, isDisabled } = this.state;

    return (
      <>
        <Typography
          variant="h6"
          color="inherit"
        >
          Give your thoughts a bout this story to help increase it's visibility!
        </Typography>

        {shouldShowLoading
          ? (
            <LoadingCmp
              thickness={5}
              size={20}
            />
          )
          : (
            <Rating
              disabled={isDisabled}
              initialValue={initialValue}
              max={Object.keys(STORY_RATING_LABELS).length}
              labels={STORY_RATING_LABELS}
              onChange={this.onChange}
            />
          )
        }
      </>
    );
  };

  render() {
    return (
      <Card>
        <CardHeader title={this.getTitle()}/>
        <CardContent>
          {this.getContentText()}
        </CardContent>
      </Card>
    );
  }
}

StoryRating.propTypes = {
  initialValue: PropTypes.number,
  player: PropTypes.instanceOf(PlayerModel).isRequired,
  story: PropTypes.instanceOf(StoryModel).isRequired,
  onInit: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default StoryRating;
