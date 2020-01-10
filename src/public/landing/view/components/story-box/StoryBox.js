import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
  Card,
  CardContent,
  CardMedia,
  Collapse,
  List,
  ListItem,
  ListItemText, Typography,
} from '@material-ui/core';
import classNames from 'classnames';

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

  renderStorySummarySection = () => {
    const {
      classes,
      story: { rating, ratingTimes, humanReadTimes }
    } = this.props;

    return (
      <List className={classNames(classes.root, classes.storySummary)}>
        <ListItem divider={true}>
          <ListItemText primary="Statistics" />
        </ListItem>
        <ListItem className={classes.summaryListItem}>
          <ListItemText primary={<>Read: <b>{humanReadTimes}</b> times</>} />
        </ListItem>
        <ListItem className={classes.summaryListItem}>
          <ListItemText
            primary={(
              <>
                Rating:&nbsp;<b>{rating}</b>&nbsp;
                <i>
                  <Typography
                    color={'textSecondary'}
                    variant="caption"
                  >
                    ({ratingTimes} {ratingTimes === 1 ? 'vote' : 'votes'})
                  </Typography>
                </i>
              </>
            )}
          />
        </ListItem>
      </List>
    );
  };

  renderStoryCoverSection = () => {
    const { story, classes } = this.props;
    return (
      <div className={classes.storyCover}>
        <CardMedia
          component='img'
          image={story.coverPic || notFoundImg}
          title={story.name}
        />
        {this.renderStorySummarySection()}
      </div>
    );
  };

  renderStoryContentSection = () => {
    const { story, classes } = this.props;
    const { expanded, isAvailableOffline } = this.state;

    return (
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
    );
  };

  render() {
    const { story, classes } = this.props;
    const { expanded } = this.state;

    return (
      <>
        <Card className={classes.card}>
          <div className={classes.visibleContent}>
            {this.renderStoryCoverSection()}
            {this.renderStoryContentSection()}
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
