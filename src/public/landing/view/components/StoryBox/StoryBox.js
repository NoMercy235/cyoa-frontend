import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import { TagModel } from '../../../../../shared/domain/models/TagModel';
import ViewRow from '../../../../../shared/components/table/actions/ViewRow';
import { withRouter } from 'react-router-dom';
import { makePath, READ_STORY_ROUTE } from '../../../../../shared/constants/routes';
import ShareButton from './ShareButton';

const styles = theme => ({
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class StoryBox extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  getSubheader = () => {
    const { story } = this.props;
    return [
      story.authorShort,
      story.createdAtShort,
      story.tags.map(t => TagModel.getOne(t).name).join(', '),
    ].filter(v => v).join(' - ');
  };

  makePath = (withOrigin = false) => {
    let path = '';
    if (withOrigin) {
      path += window.location.origin;
    }
    path += makePath(READ_STORY_ROUTE, { ':id': this.props.story._id});
    return path;
  };

  goToReadStory = history => () => {
    history.push(this.makePath());
  };

  getReadBtn = () => {
    const Btn = withRouter(({ history }) => (
      <ViewRow
        onClick={this.goToReadStory(history)}
        fontSize="default"
      />
    ));

    return <Btn />;
  };

  render() {
    const { story, classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {(story.authorShort[0] || 'N/A').toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={story.name}
          subheader={this.getSubheader()}
        />
        {/*
          For when the stories will have pictures
          <CardMedia
          className={classes.media}
          image="/static/images/cards/paella.jpg"
          title="Paella dish"
        />*/}
        <CardContent>
          <Typography component="p">
            {story.shortDescription}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          {this.getReadBtn()}
          <ShareButton text={this.makePath(true)}/>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {story.longDescription}
          </CardContent>
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
