import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { storyService } from '../../../../../infrastructure/services/StoryService';
import { styles } from './StoryBox.css';
import StoryHeader from './StoryHeader';
import StoryActions from './StoryActions';

class StoryBox extends Component {
  state = { expanded: false, coverPic: '' };

  handleExpandClick = async () => {
    const storyGet = await storyService.get(this.props.story._id);
    this.setState(state => ({
      expanded: !state.expanded,
      coverPic: storyGet.coverPic,
    }));
  };

  parseDescription = (description) => {
    return description.split('\n').map((line, i) => {
      if (line === '') return <br key={i}/>;
      return (
        <Typography component="p" key={i}>
          {line}
        </Typography>
      );
    });
  };

  render() {
    const { story, classes } = this.props;

    return (
      <Card className={classes.card}>
        <StoryHeader story={story}/>
        <CardContent>
          {this.parseDescription(story.shortDescription)}
        </CardContent>
        <StoryActions
          story={story}
          handleExpandClick={this.handleExpandClick}
        />
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <div className={classes.expandedContainer}>
            <img
              alt="Cover picture"
              className={classes.coverPic}
              src={this.state.coverPic}
            />
            <CardContent>
              {this.parseDescription(story.longDescription)}
            </CardContent>
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
