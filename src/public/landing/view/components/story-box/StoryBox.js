import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Card, CardContent, CardMedia, Collapse } from '@material-ui/core';

import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
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
    this.setState(state => ({
      expanded: !state.expanded,
    }));
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
          <div className={classes.visibleContent}>
            <div className={classes.storyCover}>
              <CardMedia
                component='img'
                image={story.coverPic || notFoundImg}
                title={story.name}
              />
            </div>
            <div className={classes.storyContent}>
              <StoryHeader
                story={story}
                isAvailableOffline={isAvailableOffline}
                makeStoryAvailableOffline={this.makeStoryAvailableOffline}
              />
              <CardContent className={classes.cardContent}>
                {parseContent(story.shortDescription)}
              </CardContent>
              <StoryActions
                story={story}
                expanded={expanded}
                isAvailableOffline={isAvailableOffline}
                handleExpandClick={this.handleExpandClick}
              />
            </div>
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className={classes.expandedContainer}>
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
