import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class StoryContent extends Component {
  render() {
    const { story } = this.props;
    const { startSeq: seq } = story;

    return (
      <Card>
        <CardContent>
          {seq.content}
        </CardContent>
      </Card>
    );
  }
}

StoryContent.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
};

export default StoryContent;
