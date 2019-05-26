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
import { SnackbarEnum } from '../../../../../shared/components/snackbar/Snackbar';
import Snackbar from '../../../../../shared/components/snackbar/Snackbar';

class StoryBox extends Component {
  state = {
    expanded: false,
    coverPic: '',
    isAvailableOffline: false,
  };
  snackbarRef = React.createRef();

  makeStoryAvailableOffline = async isAvailableOffline => {
    const { story } = this.props;

    this.setState({ isAvailableOffline });
    const offlineStory = await publicStoryService.getOfflineStory(story._id);

    if (isAvailableOffline) {
      await story.saveOffline(offlineStory);
      this.snackbarRef.current.showSnackbar({
        variant: SnackbarEnum.Variants.Success,
        message: 'Story is now available offline',
      });
    } else {
      await story.removeOffline();
      this.snackbarRef.current.showSnackbar({
        variant: SnackbarEnum.Variants.Success,
        message: 'Story no longer available offline',
      });
    }
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
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

StoryBox.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryBox);
