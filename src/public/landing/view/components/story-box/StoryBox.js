import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Card, CardContent, Collapse } from '@material-ui/core';

import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { publicStoryService } from '../../../../../infrastructure/services/StoryService';
import StoryHeader from './StoryHeader';
import StoryActions from './StoryActions';
import { parseContent } from '../../../../../shared/utilities';
import notFoundImg from '../../../../../assets/notfound.png';

import { styles } from './StoryBox.css';

class StoryBox extends Component {
  state = {
    expanded: false,
    coverPic: '',
    isAvailableOffline: false,
  };

  makeStoryAvailableOffline = async isAvailableOffline => {
    const { story, makeStoryAvailableOffline } = this.props;

    this.setState({ isAvailableOffline });
    makeStoryAvailableOffline(story, isAvailableOffline);
  };

  handleExpandClick = async () => {
    const newExpansion = !this.state.coverPic;
    if (newExpansion) {
      const story = await publicStoryService.get(this.props.story._id);
      this.setState(state => ({
        expanded: !state.expanded,
        coverPic: story.coverPic,
      }));
    } else {
      this.setState(state => ({
        expanded: !state.expanded,
      }));
    }
  };

  renderImage = () => {
    const { classes } = this.props;
    const { coverPic } = this.state;

    return coverPic && (
      <img
        alt="Cover"
        className={classes.coverPic}
        src={coverPic || notFoundImg}
      />
    );
  };

  isStoryOffline = async () => {
    const isStoryOffline = await this.props.story.isOffline();
    if (isStoryOffline) {
      this.setState({ isAvailableOffline: true });
    }
  };

  async componentDidMount () {
    await this.isStoryOffline();
  }

  render() {
    const { story, classes } = this.props;
    const { expanded, isAvailableOffline } = this.state;

    return (
      <>
        <Card className={classes.card}>
          <StoryHeader
            story={story}
            isAvailableOffline={isAvailableOffline}
            makeStoryAvailableOffline={this.makeStoryAvailableOffline}
          />
          <CardContent>
            {parseContent(story.shortDescription)}
          </CardContent>
          <StoryActions
            story={story}
            expanded={expanded}
            isAvailableOffline={isAvailableOffline}
            handleExpandClick={this.handleExpandClick}
          />
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className={classes.expandedContainer}>
              {this.renderImage()}
              {parseContent(story.longDescription)}
            </div>
          </Collapse>
        </Card>
      </>
    );
  }
}

StoryBox.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  classes: PropTypes.object.isRequired,

  makeStoryAvailableOffline: PropTypes.func.isRequired,
};

export default withStyles(styles)(StoryBox);
