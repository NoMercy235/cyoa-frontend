import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import ViewRow from '../../../../../shared/components/table/actions/ViewRow';
import { withRouter } from 'react-router-dom';
import { makePath, READ_STORY_ROUTE } from '../../../../../shared/constants/routes';
import ShareButton from '../ShareButton';
import { styles } from './StoryBox.css';

class StoryActions extends Component {
  state = { expanded: false, coverPic: '' };

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
    const { classes } = this.props;

    return (
      <CardActions className={classes.actions} disableActionSpacing>
        {this.getReadBtn()}
        <ShareButton text={this.makePath(true)}/>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: this.state.expanded,
          })}
          onClick={this.props.handleExpandClick}
          aria-expanded={this.state.expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
    );
  }
}

StoryActions.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  handleExpandClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryActions);
