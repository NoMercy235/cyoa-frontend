import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { publicStoryService } from '../../../../../infrastructure/services/StoryService';
import { styles } from './StoryBox.css';
import StoryHeader from './StoryHeader';
import StoryActions from './StoryActions';
import { parseContent } from '../../../../../shared/utilities';
import notFoundImg from '../../../../../assets/notfound.png';

class StoryBox extends Component {
  state = { expanded: false, coverPic: '' };

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

  render() {
    const { story, classes } = this.props;
    const { expanded } = this.state;

    return (
      <Card className={classes.card}>
        <StoryHeader story={story}/>
        <CardContent>
          {parseContent(story.shortDescription)}
        </CardContent>
        <StoryActions
          story={story}
          expanded={expanded}
          handleExpandClick={this.handleExpandClick}
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div className={classes.expandedContainer}>
            {this.renderImage()}
            {parseContent(story.longDescription)}
          </div>
        </Collapse>
      </Card>
    );
  }
}

StoryBox.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryBox);
